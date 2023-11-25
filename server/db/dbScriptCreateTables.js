const { pool } = require("../db/dbConfig");

pool.query(`CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  password TEXT NOT NULL,
  type TEXT NOT NULL,
  subscribedCourses BIGINT[]
);`, [], (dberr, dbres) => {
    if (dberr) {
      console.log(dberr);
    }
    else{      
      console.log('Users table created successfully');
    };
  });

pool.query(`CREATE TABLE courses (
  courseId BIGINT PRIMARY KEY,
  courseTitle TEXT NOT NULL,
  courseInstructor TEXT,
  imageLink TEXT,
  subscribers TEXT[]
);`, [], (dberr, dbres) => {
    if (dberr) {
      console.log(dberr);
    }
    else{      
      console.log('courses table created successfully');
    };
  });


pool.query(`INSERT INTO users (email, password, type, name)
VALUES ($1, $2, $3)
RETURNING id, password`, ["john@gmail.com", "123456", 'admin', "John Doe"], (err, dbres) => {
  if (err) {
    console.log(err);
  }
  else{
    console.log('inserted john user into users');
  }
});

pool.query(`INSERT INTO users (email, password, type, name)
VALUES ($1, $2, $3)
RETURNING id, password`, ["john@gmail.com", "123456", 'admin', "John Doe"], (err, dbres) => {
  if (err) {
    console.log(err);
  }
  else{
    console.log('inserted john user into users');
    console.log(dbres.rows);
  }
});

pool.query(`INSERT INTO courses ("courseTitle", "courseInstructor") VALUES ($1, $2)
  RETURNING "courseIdINSERT", "courseTitle"`,
 ["CS699", "B Raman"], (err, dbres) => {
  if (err) {
    console.log(err);
  }
  else{
    console.log('inserted CS699 into courses');
    console.log(dbres.rows);
  }
});