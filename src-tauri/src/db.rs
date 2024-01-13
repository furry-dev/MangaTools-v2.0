use std::{fs, path::Path};
use dirs;
use crate::config::DB_PATH;
use rusqlite::{Connection};

pub fn init() {
    if !db_file_exists() {
        create_db_file();
    }

    let conn = Connection::open(get_db_path()).expect("Error open DB file!");
    create_tables(&conn);
    conn.close().unwrap();
}

fn create_tables(conn: &Connection) {
    conn.execute(
        "
            CREATE TABLE IF NOT EXISTS langs
            (
                id        INTEGER PRIMARY KEY AUTOINCREMENT,
                name      TEXT                                NOT NULL,
                create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
            );

            CREATE TABLE IF NOT EXISTS sounds
            (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                text       TEXT                                NOT NULL,
                lang       INTEGER                             NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                FOREIGN KEY (lang) REFERENCES langs (id)
            );

            CREATE TABLE IF NOT EXISTS trans
            (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                sound_id   INTEGER                             NOT NULL,
                trans_id   INTEGER                             NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                UNIQUE (sound_id, trans_id),
                FOREIGN KEY (sound_id) REFERENCES sounds (id),
                FOREIGN KEY (trans_id) REFERENCES sounds (id)
            );
            ",
        []
    ).expect("Error create tables in database!");
}

fn create_db_file() {
    let db_path = get_db_path();
    let db_dir = Path::new(&db_path).parent().unwrap();

    if !db_dir.exists() {
        fs::create_dir_all(db_dir).unwrap();
    }

    println!("{:?}", &db_path);
    fs::File::create(db_path).unwrap();
}

fn get_db_path() -> String {
    let mut config_dir = dirs::config_dir().expect("Error get configuration dir");
    config_dir.push("MangaTools");

    config_dir.push(&DB_PATH);

    let full_path = config_dir.to_str().unwrap().to_string();
    println!("Полный путь: {}", full_path);

    return full_path;
}

fn db_file_exists() -> bool {
    Path::new(&get_db_path()).exists()
}
