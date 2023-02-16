INSERT INTO department (depName) 
VALUES 
("Sight"),
("Touch"),
("scent");

INSERT INTO role (title, salary, department_id) 
VALUES 
("Colour", 50000, 1),
("Pain", 40000, 2),
("Sweet", 10000, 3),
("Sour", 50000, 2),
("Exposure", 80000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id) 
VALUES 
("Red", "Rover", 1, null),
("Blue", "Skye", 1, null),
("Sharp", "Wit", 2, 1),
("Penelope", "Sweets", 3, null),
("Lemon", "Sherbert", 4, 2),
("Bright", "Light", 5, 3),
("Dark", "Knight", 5, 3);