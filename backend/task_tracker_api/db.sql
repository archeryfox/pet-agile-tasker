CREATE TABLE Role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
);

CREATE TABLE Project (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    start_date DATE,
    end_date DATE
);

CREATE TABLE Team (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    lead_id INT,
    FOREIGN KEY (lead_id) REFERENCES User(id)
);

CREATE TABLE Employee (
    user_id INT,
    team_id INT,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (team_id) REFERENCES Team(id)
);

CREATE TABLE Priority (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE TaskStatus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE Task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(255),
    status_id INT,
    priority_id INT,
    start_date DATE,
    due_date DATE,
    assigned_to_id INT,
    project_id INT,
    FOREIGN KEY (status_id) REFERENCES TaskStatus(id),
    FOREIGN KEY (priority_id) REFERENCES Priority(id),
    FOREIGN KEY (assigned_to_id) REFERENCES Employee(id),
    FOREIGN KEY (project_id) REFERENCES Project(id)
);

CREATE TABLE TaskComment (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    user_id INT,
    comment_text VARCHAR(255),
    comment_date DATETIME,
    FOREIGN KEY (task_id) REFERENCES Task(id),
    FOREIGN KEY (user_id) REFERENCES User(id)
);

CREATE TABLE History (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    user_id INT,
    field_changed VARCHAR(255),
    old_value VARCHAR(255),
    new_value VARCHAR(255),
    change_date DATETIME,
    FOREIGN KEY (task_id) REFERENCES Task(id),
    FOREIGN KEY (user_id) REFERENCES User(id)
);

CREATE TABLE Log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    action VARCHAR(255),
    timestamp DATETIME,
    FOREIGN KEY (user_id) REFERENCES User(id)
);

CREATE TABLE UserRole (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    role_id INT,
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (role_id) REFERENCES Role(id)
);


CREATE TRIGGER log_user_creation_trigger AFTER INSERT ON your_user_table
FOR EACH ROW
BEGIN
    INSERT INTO log_table (user_id, action, timestamp)
    VALUES (NEW.id, 'components created', NOW());
END;


CREATE TRIGGER update_task_status_history_trigger AFTER UPDATE ON your_task_table
FOR EACH ROW
BEGIN
    IF OLD.status_id != NEW.status_id THEN
        INSERT INTO history_table (task_id, user_id, field_changed, old_value, new_value, change_date)
        VALUES (NEW.id, NEW.assigned_to_user_id, 'Status', OLD.status_id, NEW.status_id, NOW());
    END IF;
END;


CREATE TRIGGER update_task_due_date_history_trigger AFTER UPDATE ON your_task_table
FOR EACH ROW
BEGIN
    IF OLD.due_date != NEW.due_date THEN
        INSERT INTO history_table (task_id, user_id, field_changed, old_value, new_value, change_date)
        VALUES (NEW.id, NEW.assigned_to_user_id, 'Due Date', OLD.due_date, NEW.due_date, NOW());
    END IF;
END;
