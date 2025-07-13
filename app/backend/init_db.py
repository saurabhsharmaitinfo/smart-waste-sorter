import sqlite3
import os

def init_db():
    try:
        print(f"Current working directory: {os.getcwd()}")
        db_path = 'recycling_rules.db'
        print(f"Attempting to create database at: {os.path.abspath(db_path)}")
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        print("Connected to SQLite database")
        cursor.execute('''CREATE TABLE IF NOT EXISTS rules
                         (category TEXT PRIMARY KEY, instructions TEXT)''')
        print("Created rules table")
        cursor.executemany(
            '''INSERT OR REPLACE INTO rules (category, instructions) VALUES (?, ?)''',
            [
                ('cardboard', 'Flatten and place in paper bin'),
                 ('glass', 'Glass: Place in glass container'),
                 ('metal', 'Metal: Clean and recycle in yellow bin'),
                 ('paper', 'Paper: Place in paper bin'),
                 ('plastic', 'Plastic: Rinse and place in blue bin'),
                 ('trash', 'Trash: No category, completely trashed, place in the dustbin')
            ]
        )
        print("Inserted data into rules table")
        conn.commit()
        print("Changes committed")
        cursor.execute("SELECT * FROM rules")
        print(f"Database contents: {cursor.fetchall()}")
        conn.close()
        print("Database connection closed")
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        raise

if __name__ == "__main__":
    print("Starting database initialization")
    init_db()
    print("Database initialization completed")