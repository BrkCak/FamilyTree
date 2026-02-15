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

INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (1, 'Lukas Weber', 1945, NULL, 'M', 'Berlin', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (2, 'Lea Müller', 1950, NULL, 'F', 'Munich', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (3, 'Marie Schmidt', 1938, 2005, 'F', 'Hamburg', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (4, 'Jonas Schneider', 1965, NULL, 'M', 'Cologne', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (5, 'Sofia Fischer', 1978, NULL, 'F', 'Frankfurt', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (6, 'Max Meyer', 1982, NULL, 'M', 'Stuttgart', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (7, 'Emma Wagner', 1990, NULL, 'F', 'Düsseldorf', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (8, 'Noah Becker', 2001, NULL, 'M', 'Dortmund', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (9, 'Mia Schulz', 2010, NULL, 'F', 'Essen', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (10, 'Paul Hoffmann', 1970, NULL, 'M', 'Leipzig', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (11, 'Anna Bauer', 1955, NULL, 'F', 'Bremen', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (12, 'Luis Klein', 1948, 2010, 'M', 'Dresden', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (13, 'Lena Richter', 1968, NULL, 'F', 'Hanover', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (14, 'Felix Wolf', 1985, NULL, 'M', 'Nuremberg', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (15, 'Laura Neumann', 1995, NULL, 'F', 'Wiesbaden', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (16, 'Elias Braun', 1932, 2002, 'M', 'Berlin', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (17, 'Nina Krüger', 1940, NULL, 'F', 'Munich', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (18, 'Finn Hofmann', 1975, NULL, 'M', 'Hamburg', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (19, 'Clara Köhler', 1988, NULL, 'F', 'Cologne', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (20, 'David Schröder', 2003, NULL, 'M', 'Frankfurt', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (21, 'Julia Hoffmann', 1992, NULL, 'F', 'Stuttgart', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (22, 'Oliver Bauer', 1960, NULL, 'M', 'Düsseldorf', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (23, 'Lara Klein', 1972, NULL, 'F', 'Dortmund', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (24, 'Tom Richter', 1980, NULL, 'M', 'Essen', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (25, 'Sara Wolf', 1983, NULL, 'F', 'Leipzig', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (26, 'Ben Neumann', 1958, NULL, 'M', 'Bremen', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (27, 'Hannah Braun', 1963, NULL, 'F', 'Dresden', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (28, 'Jakob Mayer', 1979, NULL, 'M', 'Hanover', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (29, 'Amelie Lang', 1999, NULL, 'F', 'Nuremberg', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (30, 'Samuel Schulze', 2000, NULL, 'M', 'Wiesbaden', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (31, 'Nora Fischer', 1946, NULL, 'F', 'Berlin', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (32, 'Simon Meyer', 1976, NULL, 'M', 'Munich', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (33, 'Luisa Wagner', 1987, NULL, 'F', 'Hamburg', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (34, 'Henry Becker', 1991, NULL, 'M', 'Cologne', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (35, 'Emily Schulz', 1952, NULL, 'F', 'Frankfurt', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (36, 'Anton Hoffmann', 1967, NULL, 'M', 'Stuttgart', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (37, 'Maya Bauer', 1984, NULL, 'F', 'Düsseldorf', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (38, 'Leon Klein', 2002, NULL, 'M', 'Dortmund', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (39, 'Isabel Richter', 1997, NULL, 'F', 'Essen', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (40, 'Philip Wolf', 1942, 2018, 'M', 'Leipzig', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (41, 'Greta Neumann', 1971, NULL, 'F', 'Bremen', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (42, 'Oskar Braun', 1989, NULL, 'M', 'Dresden', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (43, 'Frida Mayer', 1993, NULL, 'F', 'Hanover', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (44, 'Theo Lang', 1959, NULL, 'M', 'Nuremberg', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (45, 'Miriam Schulze', 1986, NULL, 'F', 'Wiesbaden', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (46, 'Jan Fischer', 1994, NULL, 'M', 'Berlin', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (47, 'Carla Meyer', 1951, NULL, 'F', 'Munich', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (48, 'Mark Wagner', 1969, NULL, 'M', 'Hamburg', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (49, 'Eva Becker', 1977, NULL, 'F', 'Cologne', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (50, 'Moritz Schulz', 2004, NULL, 'M', 'Frankfurt', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (51, 'Paula Hoffmann', 1981, NULL, 'F', 'Stuttgart', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (52, 'Lukas Bauer', 1936, 2009, 'M', 'Düsseldorf', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (53, 'Lena Klein', 1949, NULL, 'F', 'Dortmund', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (54, 'Felix Richter', 1956, NULL, 'M', 'Essen', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (55, 'Laura Wolf', 1962, NULL, 'F', 'Leipzig', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (56, 'Elias Neumann', 1973, NULL, 'M', 'Bremen', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (57, 'Nina Braun', 1988, NULL, 'F', 'Dresden', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (58, 'Finn Mayer', 1996, NULL, 'M', 'Hanover', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (59, 'Clara Lang', 2006, NULL, 'F', 'Nuremberg', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (60, 'David Schulze', 1974, NULL, 'M', 'Wiesbaden', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (61, 'Julia Fischer', 1957, NULL, 'F', 'Berlin', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (62, 'Oliver Meyer', 1961, NULL, 'M', 'Munich', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (63, 'Lara Wagner', 1983, NULL, 'F', 'Hamburg', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (64, 'Tom Becker', 1984, NULL, 'M', 'Cologne', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (65, 'Sara Schulz', 1990, NULL, 'F', 'Frankfurt', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (66, 'Ben Hoffmann', 1992, NULL, 'M', 'Stuttgart', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (67, 'Hannah Bauer', 2007, NULL, 'F', 'Düsseldorf', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (68, 'Jakob Klein', 1944, 2016, 'M', 'Dortmund', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (69, 'Amelie Richter', 1974, NULL, 'F', 'Essen', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (70, 'Samuel Wolf', 1989, NULL, 'M', 'Leipzig', NULL);
INSERT INTO family_nodes (id, name, birth_year, death_year, sex, city, notes) VALUES (71, 'Nora Neumann', 1998, NULL, 'F', 'Bremen', NULL);
