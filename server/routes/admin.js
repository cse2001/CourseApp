const mongoose = require("mongoose");
const express = require('express');
const { User, Course, Admin } = require("../db");
const jwt = require('jsonwebtoken');
const { SECRET } = require("../middleware/auth")
const { authenticateJwt } = require("../middleware/auth");

const router = express.Router();
const { pool } = require("../db/dbConfig");


router.get("/me", authenticateJwt, async (req, res) => {
    // const admin = await Admin.findOne({ username: req.user.username });
    console.log("admin/me :");
    console.log(req.user);
    pool.query(`SELECT * FROM users WHERE email = $1`, [req.user.username], (err, dbres) => {
      if (err){
        throw err;
      }
      else{
        if (dbres.rows.length == 0){
          res.status(403).json({message: "Admin doesnt exist"})
          return
        }
        res.json({username: dbres.rows[0].email, userType: dbres.rows[0].type, userCourses: dbres.rows[0].subscribedCourses })
      }
    })    
});

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    let errors = [];
    if (!username || !password){
      errors.push({message: "Please enter all fields."})
    }

    // add more error test cases here

    if (errors.length > 0){
      res.status(403).json({message: errors});
    }
    else{
      // Form validation passed
      const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '1h' });
      pool.query(`SELECT * FROM users
                  WHERE email = $1`, [username], (err, dbres) => {
                    if (err) {
                      throw err
                    }

                    // console.log(dbres.rows);

                    if (dbres.rows.length > 0 ){
                      errors.push({message: "Email Already Exists."})
                      res.status(403).json({message: "Email Already Exists."});
                    }
                    else{
                      pool.query(`INSERT INTO users (email, password, type)
                                  VALUES ($1, $2, $3)
                                  RETURNING id, password`, [username, password, 'admin'], (err, dbres) => {
                                    if (err) {
                                      throw err;
                                    }
                                    else{
                                      console.log(dbres.rows);
                                      res.json({ message: 'Admin created successfully', token });
                                    }
                                  })
                    }
                  })
    }
  });
  
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    pool.query(`SELECT * FROM users WHERE email = $1 AND password = $2`, [username, password], (err, dbres) => {
      if (err){
        throw err;
      }
      console.log("admin/login (post)");
      console.log(dbres.rows); // user row from db
      
      if (dbres.rows.length == 0){
        
        res.status(403).json({ message: 'Invalid email or password' });
      }
      else {
        const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '2h' });
        res.json({ message: 'success login', user: dbres.rows[0], token }); //sent user object back to client, setting in component LoginBox/Button/Login
      }
      
    })
  });
  
  router.post('/courses', authenticateJwt, async (req, res) => {
    // const course = new Course(req.body);
    const { title, instructor, imageLink, subscribers} = req.body;
    pool.query(`SELECT * FROM courses WHERE "courseTitle" = $1`, [title], (dberr, dbres) => {
      if (dberr) {
        throw dberr;
      }
      if (dbres.rows.length > 0) {
        res.status(401).json({message : "Course title already exists"})
        return
      }
      else{
        pool.query(`INSERT INTO courses ("courseTitle", "courseInstructor", "imageLink", "subscribers")
                                  VALUES ($1, $2, $3, $4)
                                  RETURNING "courseId", "courseTitle"`, [title, instructor, imageLink, subscribers], (dberr, dbres) => {
                                    if (dberr) {
                                      throw dberr;
                                    }
                                    else{
                                      console.log(dbres.rows);
                                      const course = dbres.rows[0]
                                      res.json({ message: 'Course created successfully', courseId: course.courseId, courseTitle: course.courseTitle });
                                    }
                                  })
      }
    })
  });
  
  router.put('/courses/:courseId', authenticateJwt, async (req, res) => {
    const course = await Course.findByIdAndUpdate(req.params.courseId, req.body, { new: true });
    if (course) {
      res.json({ message: 'Course updated successfully' });
    } else {
      res.status(404).json({ message: 'Course not found' });
    }
  });
  
  router.get('/courses', authenticateJwt, async (req, res) => {
    // const courses = await Course.find({});
    console.log("Getting all courses");
    pool.query(`SELECT * FROM courses`, [], (dberr, dbres) => {
      if (dberr) {
        throw dberr;
      }
      
      if (dbres.rows.length == 0) {
        res.json({courses : []});
      }
      else {
        res.json({courses : dbres.rows});
      }
    })
  });
  
  router.get('/course/:courseId', authenticateJwt, async (req, res) => {
    const courseId = req.params.courseId;
    pool.query(`SELECT * FROM courses WHERE "courseId" = $1`, [courseId], (dberr, dbres) => {
      if (dberr) {
        throw dberr;
      }
      if (dbres.rows.length == 0) {
        res.json({courses : []});
      }
      else {
        console.log(dbres.rows[0]);
        res.json({course : dbres.rows[0]});
      }
    })
  });

  router.post('/courses/:courseId', authenticateJwt, async (req, res) => {
    const courseId = req.params.courseId;
    //check if course already subscribed
    pool.query(`SELECT * FROM users WHERE email = $1 AND $2 = ANY("subscribedCourses");`, [req.body.username, courseId],
          (dberr, dbres) => {
            if (dberr) {
              throw dberr;
            }
            if (dbres.rows.length != 0) {
              res.json({message : "Course Already registered"});
            }
            else {
              // course not already registered
              pool.query(`UPDATE users SET "subscribedCourses" = array_append("subscribedCourses", $1)
              WHERE email = $2`, [courseId, req.body.username], (dberr, dbres) => {
                if (dberr) {
                  throw dberr;
                }
                else{
                  res.json({ message: 'Course registered successfully' });
                }
              });   
            }
          })
    });

  router.put('/deletecourse/:courseId', authenticateJwt, async (req, res) => {
    const courseId = req.params.courseId;
    //check if course is subscribed or not
    pool.query(`SELECT * FROM users WHERE email = $1 AND $2 = ANY("subscribedCourses");`, [req.body.username, courseId],
        (dberr, dbres) => {
          if (dberr) {
            console.log(dberr);
          }
          if (dbres.rows.length == 0) {
            // course does not exist
            res.json({message : "Course Not Registered. Please refresh."});
          }
          else {
            // course exists 
            console.log("going to delete course")
            pool.query(`UPDATE users SET "subscribedCourses" = array_remove("subscribedCourses", $1)
            WHERE email = $2`, [courseId, req.body.username], (dberr, dbres) => {
              if (dberr) {
                throw dberr;
              }
              else{
                res.json({ message: 'Course Dropped Successfully' });
              }
            });   
          }
        })
    });

module.exports = router