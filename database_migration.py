
#!/usr/bin/env python3
"""
Database migration script to add missing columns to existing tables
"""

import sqlite3
import os
from datetime import datetime

def migrate_database():
    """Add missing columns to the database"""
    db_path = "dashboard.db"
    
    if not os.path.exists(db_path):
        print("Database doesn't exist, will be created on startup")
        return
    
    print("🔄 Starting database migration...")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check if analytics columns exist
        cursor.execute("PRAGMA table_info(post_logs)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Analytics columns to add
        analytics_columns = [
            ("views", "INTEGER DEFAULT 0"),
            ("likes", "INTEGER DEFAULT 0"),
            ("shares", "INTEGER DEFAULT 0"),
            ("comments", "INTEGER DEFAULT 0"),
            ("clicks", "INTEGER DEFAULT 0"),
            ("engagement_rate", "REAL DEFAULT 0.0"),
            ("reach", "INTEGER DEFAULT 0"),
            ("impressions", "INTEGER DEFAULT 0")
        ]
        
        # SEO columns to add
        seo_columns = [
            ("seo_keywords", "TEXT"),
            ("seo_title", "TEXT"),
            ("seo_description", "TEXT"),
            ("hashtags", "TEXT"),
            ("seo_score", "REAL DEFAULT 0.0"),
            ("readability_score", "REAL DEFAULT 0.0")
        ]
        
        all_new_columns = analytics_columns + seo_columns
        
        # Add missing columns
        for column_name, column_type in all_new_columns:
            if column_name not in columns:
                try:
                    cursor.execute(f"ALTER TABLE post_logs ADD COLUMN {column_name} {column_type}")
                    print(f"✅ Added column: {column_name}")
                except sqlite3.OperationalError as e:
                    if "duplicate column name" not in str(e):
                        print(f"❌ Error adding column {column_name}: {e}")
                    else:
                        print(f"⚠️ Column {column_name} already exists")
            else:
                print(f"⚠️ Column {column_name} already exists")
        
        conn.commit()
        print("✅ Database migration completed successfully!")
        
    except Exception as e:
        print(f"❌ Migration error: {e}")
        if conn:
            conn.rollback()
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    migrate_database()
