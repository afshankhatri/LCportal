use lcsystem;
desc user;
desc student;
select * from user;

ALTER TABLE user ADD COLUMN dept int;


-- studets table
CREATE TABLE students (
    sr_no INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(120),  -- Links to users.id
    GR_no VARCHAR(100) UNIQUE,
    yearOfJoin YEAR,  -- Changed from DATE to YEAR
    courseName int,
    reasonOfLeaving VARCHAR(255),
    PRN VARCHAR(255),
    UPRN VARCHAR(255),
    isSubmitted INT,
    semester INT,
    lastLogin TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    finalYearMarksheet VARCHAR(255),
    declaration INT,
    FOREIGN KEY (user_id) REFERENCES user(Sr_No) ON DELETE CASCADE
);

DELIMITER //

CREATE TRIGGER after_user_insert
AFTER INSERT ON user
FOR EACH ROW
BEGIN
    IF NEW.user_type = 0 THEN
        INSERT INTO student (user_id,courseName)
        VALUES (NEW.email,NEW.dept);
    END IF;
END;

//
DELIMITER ;

select * from student;



-- for HOD

CREATE TABLE hod (
	sr_no INT AUTO_INCREMENT PRIMARY KEY,
    id_hod VARCHAR(120) ,
    name VARCHAR(255),
    emp_id VARCHAR(100) unique,
    dept VARCHAR(255),
    remarks TEXT,
    misconduct_flag INT DEFAULT 0,
    achievements_flag INT DEFAULT 0,
    rejection_reason VARCHAR(255),
    approval_status INT DEFAULT 0,
    last_verification_date DATE,
    date_of_joining DATETIME,
    contact_number VARCHAR(15),
    designation VARCHAR(255),
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_hod) REFERENCES user(email) ON DELETE CASCADE
);


DELIMITER //

CREATE TRIGGER after_user_insert_hod
AFTER INSERT ON user
FOR EACH ROW
BEGIN
    IF NEW.user_type = 2 THEN
        INSERT INTO hod (id_hod,dept)
        VALUES (NEW.email,NEW.dept);
    END IF;
END;

//
DELIMITER ;

ALTER TABLE student ADD COLUMN courseName int;
ALTER TABLE student DROP COLUMN courseName;

select * from hod;
select * from student;
select * from user;


-- DROP TRIGGER IF EXISTS after_user_insert;
-- SET FOREIGN_KEY_CHECKS = 0;
-- TRUNCATE TABLE user;
-- SET FOREIGN_KEY_CHECKS = 1;
-- truncate table student;
-- truncate table hod;




