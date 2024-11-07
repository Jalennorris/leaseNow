CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
 firstname VARCHAR(100) NOT NULL,
COLUMN lastname VARCHAR(100) NOT NULL,
 COLUMN username VARCHAR(100) UNIQUE NOT NULL;

   
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(15),
    password VARCHAR(255) NOT NULL
);

CREATE TABLE properties (
    property_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(10) NOT NULL,
    rent_price DECIMAL(10, 2) NOT NULL,
    description TEXT
);
    Alter table properties add column floor int;
    Alter table properties add column bed int;
    Alter table properties add column bath int;
    Alter table properties add column total_sqft int;
    ALTER TABLE properties ADD COLUMN deposit DECIMAL(10, 2);
    



CREATE TABLE leases (
    lease_id SERIAL PRIMARY KEY,
    renter_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    property_id INT REFERENCES properties(property_id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    deposit DECIMAL(10, 2) NOT NULL
   
);


Alter table leases add column lease_month int;
ALTER TABLE leases
DROP COLUMN start_date,
DROP COLUMN end_date;

Alter Table lease
Drop column desposit






CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    lease_id INT REFERENCES leases(lease_id) ON DELETE CASCADE,
    payment_date DATE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(15) CHECK (payment_status IN ('paid', 'pending', 'overdue')) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    renter_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    property_id INT REFERENCES properties(property_id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE contacts(
    contact_id SERIAl Primary key,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    message TEXT ,
    checkbox BOOLEAN NOT NULL
)





