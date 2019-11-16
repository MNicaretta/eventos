CREATE TABLE users(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NULL,
    dt_birth DATE NULL,
    cpf VARCHAR(11) NULL,
    PRIMARY KEY(id)
);

CREATE TABLE events(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT NULL,
    dt_event TIMESTAMP NOT NULL,
    PRIMARY KEY(id)
);

CREATE TABLE registrations(
    ref_user INT NOT NULL,
    ref_event INT NOT NULL,
    `state` TINYINT NOT NULL,
    dt_registration TIMESTAMP NOT NULL,
    certificate_code VARCHAR(255) NULL,
    PRIMARY KEY(ref_user, ref_event),
    CONSTRAINT registration_user FOREIGN KEY (ref_user) REFERENCES users(id),
    CONSTRAINT registration_event FOREIGN KEY (ref_event) REFERENCES events(id)
);
