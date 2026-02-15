CREATE TABLE IF NOT EXISTS family_nodes (
                                            id INTEGER PRIMARY KEY,
                                            name VARCHAR(255) NOT NULL,
    birth_year INTEGER NOT NULL,
    death_year INTEGER,
    sex CHAR(1) CHECK (sex IN ('M', 'F', 'X')),
    city VARCHAR(255),
    notes TEXT
    );

CREATE TABLE IF NOT EXISTS family_links (
                                            id INTEGER PRIMARY KEY,
                                            parent_id INTEGER NOT NULL,
                                            child_id INTEGER NOT NULL,
                                            CONSTRAINT fk_parent FOREIGN KEY (parent_id) REFERENCES family_nodes(id) ON DELETE CASCADE,
    CONSTRAINT fk_child FOREIGN KEY (child_id) REFERENCES family_nodes(id) ON DELETE CASCADE,
    CONSTRAINT self_parenting_check CHECK (parent_id <> child_id)
    );


CREATE INDEX IF NOT EXISTS idx_parent ON family_links(parent_id);
CREATE INDEX IF NOT EXISTS idx_child ON family_links(child_id);

