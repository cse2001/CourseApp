const express = require('express');
const { authenticateJwt, SECRET } = require("../middleware/auth");
const { User, Course, Admin } = require("../db");
const router = express.Router();
const jwt = require('jsonwebtoken');
const { pool } = require("../db/dbConfig");

  router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user) {
      res.status(403).json({ message: 'User already exists' });
    } else {
      const newUser = new User({ username, password });
      await newUser.save();
      const token = jwt.sign({ username, role: 'user' }, SECRET, { expiresIn: '1h' });
      res.json({ message: 'User created successfully', token });
    }
  });
  
  router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log(username);
    pool.query(`SELECT * FROM users WHERE email = $1 AND password = $2 AND type = $3`, [username, password, "user"], (err, dbres) => {
      if (err){
        throw err;
      }
      console.log(dbres.rows);
      
      if (dbres.rows.length == 0){
        
        res.status(403).json({ message: 'Invalid email or password' });
      }
      else {
        const token = jwt.sign({ username, role: 'admin' }, SECRET, { expiresIn: '2h' });
        res.json({ message: 'success login', token });
      }
      
    })
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
  
  router.post('/courses/:courseId', authenticateJwt, async (req, res) => {
    const courseId = req.params.courseId;
    pool.query(`UPDATE users SET "subscribedCourses" = array_append("subscribedCourses", $1)
                WHERE email = $2`, [courseId, req.body.username], (dberr, dbres) => {
                  if (dberr) {
                    throw dberr;
                  }
                  else{
                    console.log("new course dbres:")
                    console.log(dbres);
                    res.json({ message: 'Course purchased successfully' });
                  }
                });

    // if (course) {
    //   const user = await User.findOne({ username: req.user.username });
    //   if (user) {
    //     user.purchasedCourses.push(course);
    //     await user.save();
    //     res.json({ message: 'Course purchased successfully' });
    //   } else {
    //     res.status(403).json({ message: 'User not found' });
    //   }
    // } else {
    //   res.status(404).json({ message: 'Course not found' });
    // }
  });
  
  router.get('/purchasedCourses', authenticateJwt, async (req, res) => {
    const user = await User.findOne({ username: req.user.username }).populate('purchasedCourses');
    if (user) {
      res.json({ purchasedCourses: user.purchasedCourses || [] });
    } else {
      res.status(403).json({ message: 'User not found' });
    }
  });
  
  module.exports = router