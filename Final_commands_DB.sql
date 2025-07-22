use lcsystem;
select * from student;
select * from  user;
select * from accounts; 
select * from hod;
select * from librarian;
select * from lc_generator;

desc accounts;
desc hod;
desc student;
show triggers;
desc librarian;

-- create a table for lcGen
CREATE TABLE lc_generator (
    sr_no INT NOT NULL AUTO_INCREMENT,
    lc_id VARCHAR(120) DEFAULT NULL,
    name VARCHAR(250) NOT NULL, 
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (sr_no)
);

-- create table for verifierClerk
CREATE TABLE verifierClerk (
    sr_no INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
    name VARCHAR(250) NOT NULL,
    verifierClerk_id VARCHAR(120),
    verified_at DATETIME DEFAULT CURRENT_TIMESTAMP
);



DELIMITER //

CREATE TRIGGER after_user_insert_lc_generator
AFTER INSERT ON user
FOR EACH ROW
BEGIN
    IF NEW.user_type = 5 THEN
        INSERT INTO lc_generator (lc_id,name)
        VALUES (NEW.email,NEW.name);
    END IF;
END;

//
DELIMITER ;



-- add name column in (stud,acc,lib,lcGen) table and then add/update  a trigger to put user's name as well in their respected row
ALTER TABLE student
ADD COLUMN name VARCHAR(250) NOT NULL;


ALTER TABLE accounts
ADD COLUMN name VARCHAR(250) NOT NULL;


ALTER TABLE librarian
ADD COLUMN name VARCHAR(250) NOT NULL;

-- updating trigger students,hod,lib,acc
DROP TRIGGER IF EXISTS after_user_insert;

-- student
DELIMITER //

CREATE TRIGGER after_user_insert
AFTER INSERT ON user
FOR EACH ROW
BEGIN
    IF NEW.user_type = 0 THEN
        INSERT INTO student (user_id,courseName,name)
        VALUES (NEW.email,NEW.dept,NEW.name);
    END IF;
END;

//
DELIMITER ;

-- hod
DROP TRIGGER IF EXISTS after_user_insert_hod;
DELIMITER //

CREATE TRIGGER after_user_insert_hod
AFTER INSERT ON user
FOR EACH ROW
BEGIN
    IF NEW.user_type = 2 THEN
        INSERT INTO hod (id_hod,dept,name)
        VALUES (NEW.email,NEW.dept,NEW.name);
    END IF;
END;

//
DELIMITER ;


-- accounts

DELIMITER //

CREATE TRIGGER after_user_insert_acc
AFTER INSERT ON user
FOR EACH ROW
BEGIN
    IF NEW.user_type = 4 THEN
        INSERT INTO accounts (id_acc,name)
        VALUES (NEW.email,NEW.name);
    END IF;
END;

//
DELIMITER ;

-- library
DELIMITER //

CREATE TRIGGER after_user_insert_lib
AFTER INSERT ON user
FOR EACH ROW
BEGIN
    IF NEW.user_type = 3 THEN
        INSERT INTO librarian (id_lib,name)
        VALUES (NEW.email,NEW.name);
    END IF;
END;

//
DELIMITER ;


-- clerk verifier  
DELIMITER //

CREATE TRIGGER after_user_insert_clerkVerifier
AFTER INSERT ON user
FOR EACH ROW
BEGIN
    IF NEW.user_type = 6 THEN
        INSERT INTO verifierclerk (verifierClerk_id,name)
        VALUES (NEW.email,NEW.name);
    END IF;
END;

//
DELIMITER ;

-- for updating isVerified in students table 
DROP TRIGGER IF EXISTS after_user_updates_isVerified;

DELIMITER //

CREATE TRIGGER after_user_updates_isVerified
AFTER update ON user
FOR EACH ROW
BEGIN
    IF old.isVerified != isVerified  THEN
        UPDATE student
        SET isVerified = NEW.isVerified
        WHERE student.user_id = NEW.email;
    END IF;
END;

//
DELIMITER ;
