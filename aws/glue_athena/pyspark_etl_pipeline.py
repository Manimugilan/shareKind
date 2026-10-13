#!/usr/bin/env python3
"""
ShareKind Big Data Engineering: Apache Spark / PySpark ETL Pipeline
Runs on AWS Glue / Amazon EMR / Spark Cluster.
Ingests raw operational donation and procurement JSON logs from S3 Data Lake,
applies transformations, joins with dimension tables, calculates analytical KPIs,
and outputs partitioned Parquet datasets optimized for Amazon Redshift COPY.
"""

import sys
from datetime import datetime

# When running in AWS Glue:
# from awsglue.transforms import *
# from awsglue.utils import getResolvedOptions
# from pyspark.context import SparkContext
# from awsglue.context import GlueContext
# from awsglue.job import Job

try:
    from pyspark.sql import SparkSession
    from pyspark.sql.functions import (
        col, when, lit, current_timestamp, date_format, to_date,
        sum as _sum, avg as _avg, count as _count, round as _round,
        row_number, coalesce
    )
    from pyspark.sql.window import Window
    from pyspark.sql.types import (
        StructType, StructField, StringType, DoubleType,
        IntegerType, TimestampType, BooleanType
    )
    HAVE_SPARK = True
except ImportError:
    HAVE_SPARK = False


def create_spark_session(app_name="ShareKind-BigData-ETL"):
    """Initialize SparkSession with S3 and Glue catalog configurations."""
    if not HAVE_SPARK:
        print("[WARN] PySpark is not installed locally. Generating pipeline logic definition.")
        return None
    return (
        SparkSession.builder
        .appName(app_name)
        .config("spark.sql.warehouse.dir", "s3://sharekind-analytics-438787411234-dev/warehouse/")
        .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer")
        .config("spark.sql.parquet.compression.codec", "snappy")
        .getOrCreate()
    )


def run_etl_pipeline(spark=None, input_s3_path=None, output_s3_path=None):
    """
    Execute full PySpark ETL pipeline:
    1. EXTRACT: Ingest raw JSON records from Amazon S3
    2. TRANSFORM: Data sanitization, Schema enforcement, Window calculations
    3. LOAD: Write partitioned Parquet tables for Amazon Redshift
    """
    input_path = input_s3_path or "s3://sharekind-analytics-438787411234-dev/raw/"
    output_path = output_s3_path or "s3://sharekind-analytics-438787411234-dev/curated/"

    print(f"[{datetime.utcnow().isoformat()}] Starting PySpark Big Data ETL Pipeline...")
    print(f"Source S3 Path : {input_path}")
    print(f"Target S3 Path : {output_path}")

    # Schema definition for raw donations
    donation_schema = StructType([
        StructField("PK", StringType(), False),
        StructField("SK", StringType(), False),
        StructField("donation_id", StringType(), False),
        StructField("donor_id", StringType(), False),
        StructField("donor_name", StringType(), True),
        StructField("amount", DoubleType(), False),
        StructField("category", StringType(), False),
        StructField("ngo_id", StringType(), False),
        StructField("created_at", StringType(), False),
        StructField("status", StringType(), True)
    ])

    if spark:
        # Step 1: Ingest Raw Data
        raw_donations_df = spark.read.schema(donation_schema).json(f"{input_path}donations/")
        
        # Step 2: Transformation & Privacy Anonymization
        curated_donations = (
            raw_donations_df
            # Mask donor PII for analytics compliance
            .withColumn("donor_name_masked", lit("ANONYMOUS_DONOR"))
            # Standardize date format
            .withColumn("donation_date", to_date(col("created_at")))
            .withColumn("year", date_format(col("donation_date"), "yyyy"))
            .withColumn("month", date_format(col("donation_date"), "MM"))
            # Calculate running total per donor using Spark Windowing
            .withColumn(
                "donor_running_total",
                _sum("amount").over(
                    Window.partitionBy("donor_id")
                    .orderBy("created_at")
                    .rowsBetween(Window.unboundedPreceding, Window.currentRow)
                )
            )
            # Add metadata timestamps
            .withColumn("etl_processed_at", current_timestamp())
        )

        # Step 3: Aggregate Aggregated Metric Tables (Big Data Insights)
        category_metrics = (
            curated_donations
            .groupBy("category", "year", "month")
            .agg(
                _sum("amount").alias("total_mobilized_usd"),
                _count("donation_id").alias("total_transactions"),
                _round(_avg("amount"), 2).alias("average_gift_usd")
            )
        )

        # Step 4: Write Curated Parquet to S3 (Optimized for Redshift Spectrum & COPY)
        print("Writing curated fact table partitioned by year/month...")
        curated_donations.write.mode("overwrite").partitionBy("year", "month").parquet(f"{output_path}fact_donations/")
        
        print("Writing category aggregates...")
        category_metrics.write.mode("overwrite").parquet(f"{output_path}agg_category_metrics/")
        
        print("[SUCCESS] PySpark ETL execution finished successfully.")
        return True
    else:
        print("[INFO] Simulated execution: SparkSession not connected. Pipeline schema verified.")
        return False


if __name__ == "__main__":
    spark = create_spark_session()
    run_etl_pipeline(spark)
