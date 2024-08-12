const express = require('express');
const ExpressError = require('./expressError')
const app = express();

app.use(express.json());

app.get('/mean', ((req, res, next) => {
    if (!req.query.nums) {
        throw new ExpressError('Comma-sparated Nums are required', 400)
    }

    let getNums = req.query.nums.split(',');
    let goodNums = getNums.map(num => {
        let parsed = parseFloat(num);
        if (isNaN(parsed)) {
            throw new ExpressError(`'${num}' is not a valid number.`, 400);
        }
        return parsed;
    });

    let mean = goodNums.reduce((acc, val) => acc + val, 0) / goodNums.length;

    res.json({ operation: "mean", value: mean });
}));

app.get('/median', ((req, res, next) => {
    if (!req.query.nums) {
        throw new ExpressError('Comma-separated Nums are required', 400);
    }

    let getNums = req.query.nums.split(',');
    
    let goodNums = getNums.map(num => {
        let parsed = parseFloat(num);
        if (isNaN(parsed)) {
            throw new ExpressError(`'${num}' is not a valid number.`, 400);
        }
        return parsed;
    });

    goodNums.sort((a, b) => a - b);
    let median;
    let mid = Math.floor(goodNums.length / 2);

    if (goodNums.length % 2 === 0) {
        median = (goodNums[mid - 1] + goodNums[mid]) / 2;
    } else {
        median = goodNums[mid];
    }

    res.json({ operation: "median", value: median });
}));

app.get('/mode', ((req, res, next) => {
    if (!req.query.nums) {
        throw new ExpressError('Comma-separated Nums are required', 400);
    }

    let getNums = req.query.nums.split(',');
    
    let goodNums = getNums.map(num => {
        let parsed = parseFloat(num);
        if (isNaN(parsed)) {
            throw new ExpressError(`'${num}' is not a valid number.`, 400);
        }
        return parsed;
    });

    let frequency = {};
    let maxFreq = 0;
    let mode;

    goodNums.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
        if (frequency[num] > maxFreq) {
            maxFreq = frequency[num];
            mode = num;
        }
    });

    res.json({ operation: "mode", value: mode });
}));

app.use(function (req, res, next) {
    const err = new ExpressError("Method Not Found",404);
    return next(err);
});

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
  
    return res.json({
      error: err,
      message: err.message
    });
});
  
app.listen(3000, function() {
    console.log(`Server starting on port 3000`);
});