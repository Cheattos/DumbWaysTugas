const express = require('express')
const path = require('path')
const app = express()
const PORT = 5000
const fs = require('fs');
const hbs = require('hbs');
const bcrypt = require('bcrypt')
const session = require('express-session')
const flash = require('express-flash')
const multer = require('multer');
const upload = require('./middlewares/uploadFile')
const { v4: uuidv4 } = require('uuid');
const Blog = require('./models/myblog');

//viewdb
const config = require('./config/config.json')
const { Sequelize, QueryTypes } = require("sequelize")
const sequelize = new Sequelize(config.development)

// setup to call hbs 
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'src/view'))

// set static file server
app.use(express.static('public/asset'))
app.use(express.static('public/asset/uploads'))

// parsing data from client
app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// local server
app.listen(PORT, () => {
    console.log("Server running on port 5000");
})

// setup flash
app.use(flash())

// setup session express
app.use(session({
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60 * 2
    },
    store: new session.MemoryStore(),
    saveUninitialized: true,
    resave: false,
    secret: 'uhuy240true'
})
)

app.get('/', home)
app.get('/contact', contact)
app.get('/login', login)
app.get('/myproject', myproject)
app.get('/testimoni', testimoni)
app.get('/myblog', myblog)
app.get('/detailblog/:idmyblog', detailblog)
app.get('/editmyblog/:idmyblog', editmyblog)
app.get('/formmyblog', formmyblog)
app.post('/addmyblog', upload.single('upfile'), addmyblog)
app.get('/deleteblog/:idmyblog', deleteBlog)
app.post('/updateblog/:idmyblog', upload.single('upfile'), updateblog);
app.get('/loginform', loginform)
app.post('/login', login)
app.get('/registerform', registerform)
app.post('/makan', addUser)
app.get('/logout', logout);


// fuction routing
function home(req, res) {
    const isLogin = req.session.isLogin;
    console.log(isLogin);
    res.render('index', { isLogin: isLogin });
}

function login(req, res) {
    res.render('login')
}

function contact(req, res) {
    const isLogin = req.session.isLogin;
    console.log(isLogin);
    res.render('contact', { isLogin: isLogin });
}

function myproject(req, res) {
    const isLogin = req.session.isLogin;
    console.log(isLogin);
    res.render('myproject', { isLogin: isLogin });
}

function testimoni(req, res) {
    const isLogin = req.session.isLogin;
    console.log(isLogin);
    res.render('testimoni', { isLogin: isLogin });
}

function formmyblog(req, res) {
    const isLogin = req.session.isLogin;
    console.log(isLogin);
    res.render('formmyblog', { isLogin: isLogin });
}

hbs.registerHelper('inArray', function (value, array) {
    return array.includes(value);
});

function calculateDateDuration(startdate, enddate) {
    const startDate = new Date(startdate); //2023-01-15
    const endDate = new Date(enddate); //2024-01-01

    if (startDate.getTime() === endDate.getTime()) {
        return "Tanggal mulai dan tanggal akhir sama.";
    }

    const yearsDifference = endDate.getUTCFullYear() - startDate.getUTCFullYear(); //2024-2023 =1
    const monthsDifference = endDate.getUTCMonth() - startDate.getUTCMonth(); //1-1 = 0
    const daysDifference = endDate.getUTCDate() - startDate.getUTCDate(); //15-1= -14

    if (daysDifference < 0) { //karena -14 lebih kecil dari 0 maka akan disekusi
        const daysInLastMonth = new Date( //sepeti array bulan dimulai dari 0 sehingga januari-desember menjadi 0-11
            endDate.getUTCFullYear(), //tahun endate yaitu 2023
            endDate.getUTCMonth(), //1 bulan sebelum bulan pada endate yaitu desember
            0 //untuk menampung hari
        ).getUTCDate(); //2023-desember-31
        daysDifference += daysInLastMonth; //-14+31 = 17
    }

    if (monthsDifference < 0) { //dijalankan jika bulan monthsDifference mendapatkan hasil minus, misal bulan
        // startdate 2, endadate 8 jadi 2-8=-6
        yearsDifference--; //tahun hasil pengurangan di kurangin lagi hasil 0 maka tidak akan dieksekusi
        monthsDifference += 12;
    }

    let duration = "";

    if (yearsDifference > 0) {
        duration += yearsDifference > 1 ? `${yearsDifference} tahun` : `${yearsDifference} tahun`;
    }

    if (monthsDifference > 0) {
        duration += duration ? (yearsDifference > 0 ? " " : "") : ""; //ternari dimana jika string duration tidak kosong
        //atau kondisi yearsDifference sudah ada maka akan ditambahkan nilai spasi, tapi jika ternari(?) kosong maka string 
        //duration tidak akan ditambahkan string spasi
        duration += monthsDifference > 1 ? `${monthsDifference} bulan` : `${monthsDifference} bulan`;
    }

    if (daysDifference > 0) {
        duration += duration ? (monthsDifference > 0 || yearsDifference > 0 ? " " : "") : "";
        duration += daysDifference > 1 ? `${daysDifference} hari` : `${daysDifference} hari`;
    }

    return duration;
}

async function addmyblog(req, res) {
    try {
        const { projectname, startdate, enddate, description, selectedTechnologies, title } = req.body;
        const images = req.file.filename

        // Menghitung duration menggunakan fungsi calculateDateDuration
        const duration = calculateDateDuration(startdate, enddate);

        // Mengonversi teknologi menjadi format yang sesuai untuk basis data PostgreSQL
        const technologiesArray = selectedTechnologies.map(tech => `'${tech}'`).join(', ');

        const idUser = parseInt(req.session.idUser, 10);

        const query = `
            INSERT INTO myblogs (projectname, startdate, enddate, description, technologies, images, duration, author, title, "createdAt", "updatedAt")
            VALUES ('${projectname}', '${startdate}', '${enddate}', '${description}', ARRAY[${technologiesArray}], '${images}', '${duration}', '${idUser}',' ${title}', NOW(), NOW())
        `;

        await sequelize.query(query);

        console.log(query);
        res.redirect('/myblog');
    } catch (error) {
        console.log(error);
    }
}

async function myblog(req, res) {
    try {
        const query = `SELECT * FROM myblogs LEFT JOIN usersbs ON myblogs.author = usersbs.idusersb ORDER BY idmyblog DESC`;
        const obj = await sequelize.query(query, { type: QueryTypes.SELECT });

        const data = obj.map((res) => ({
            ...res,
            isLogin: req.session.isLogin
        }))

        const blogData = obj[0];

        console.log(blogData);

        res.render('myblog', {
            blogs: data,
            data: blogData,
            isLogin: req.session.isLogin,
        })
    } catch (error) {
        console.log(error);
        // Handle error if needed
        res.status(500).send('Error fetching blogs');
    }
}

async function detailblog(req, res) {
    try {
        const { idmyblog } = req.params;
        const query = `SELECT * FROM myblogs LEFT JOIN usersbs ON myblogs.author = usersbs.idusersb WHERE idmyblog = ${idmyblog}`;
        const obj = await sequelize.query(query, { type: QueryTypes.SELECT });

        // Ambil data pertama dari hasil query
        const blogData = obj[0];

        // Modifikasi deskripsi dengan mengganti '\n' menjadi '<br>'
        const modifiedDescription = blogData.description.replace(/\n/g, '<br>');

        // Ganti deskripsi dalam data blog dengan yang sudah dimodifikasi
        blogData.description = modifiedDescription;

        console.log(blogData);
        res.render('detailblog', { blogs: blogData });
    } catch (err) {
        console.log(err);
    }
}


// async function detailblog(req, res) {
//     try {
//         const { idmyblog } = req.params // 5
//         const query = `SELECT * FROM myblogs LEFT JOIN usersbs ON myblogs.author = usersbs.idusersb WHERE idmyblog = ${idmyblog}`
//         const obj = await sequelize.query(query, { type: QueryTypes.SELECT })

//         const data = obj.map((res) => ({
//             ...res,
//         }))

//         console.log(data);
//         res.render('detailblog', { blogs: data[0] })
//     } catch (err) {
//         console.log(err);
//     }
// }

async function deleteBlog(req, res) {
    try {
        const { idmyblog } = req.params;

        // Ambil nama file gambar dari database
        const query = `SELECT images FROM myblogs WHERE idmyblog = ${idmyblog}`;
        const result = await sequelize.query(query, { type: QueryTypes.SELECT });

        if (result.length > 0) {
            const imageName = result[0].images;

            // Hapus data dari database
            await sequelize.query(`DELETE FROM myblogs WHERE idmyblog = ${idmyblog}`);

            // Hapus file gambar dari direktori uploads
            const imagePath = `public/asset/uploads/${imageName}`;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Hapus file gambar
            }

            res.redirect('/myblog');
        } else {
            // Handle jika data tidak ditemukan
            res.status(404).send("Data not found");
        }
    } catch (error) {
        console.log(error);
    }
}

async function editmyblog(req, res) {
    try {
        const { idmyblog } = req.params;
        const query = `SELECT * FROM myblogs WHERE idmyblog = :idmyblog`;
        const result = await sequelize.query(query, {
            replacements: { idmyblog },
            type: sequelize.QueryTypes.SELECT
        });


        const blogs = result[0];
        // Render the editmyblog page with the blog data
        res.render('editmyblog', { blogs });
    } catch (error) {
        console.log(error);
    }
}

async function updateblog(req, res) {
    try {
        const { idmyblog, projectname, description, startdate, enddate, selectedTechnologies } = req.body;
        const newImage = req.file; // Berkas gambar yang baru
        const duration = calculateDateDuration(startdate, enddate);
        const technologiesArray = selectedTechnologies.map(tech => `'${tech}'`).join(', ');

        // Ambil nama gambar lama dari database
        const imageData = await sequelize.query('SELECT images FROM myblogs WHERE idmyblog = :idmyblog', {
            replacements: { idmyblog },
            type: sequelize.QueryTypes.SELECT,
        });

        let oldImageName = null;

        if (imageData && imageData[0]) {
            oldImageName = imageData[0].images;
        }

        // Hapus gambar lama dari sistem file
        if (oldImageName) {
            const imagePath = path.join('public/asset/uploads', oldImageName);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Simpan nama gambar yang baru ke database
        const updateQuery = `UPDATE myblogs SET 
            projectname = :projectname,
            startdate = :startdate,
            enddate = :enddate,
            description = :description,
            technologies = ARRAY[${technologiesArray}],
            duration = :duration,
            images = :images
            WHERE idmyblog = :idmyblog`;

        await sequelize.query(updateQuery, {
            replacements: {
                projectname,
                startdate,
                enddate,
                description,
                technologiesArray,
                duration,
                images: newImage.filename, // Simpan nama gambar yang baru
                idmyblog,
            },
        });

        res.redirect('/myblog');
    } catch (err) {
        console.error(err);
    }
}

function loginform(req, res) {
    res.render('login')
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const query = `SELECT * FROM usersbs WHERE email = '${email}'`;
        let obj = await sequelize.query(query, { type: QueryTypes.SELECT });

        if (!obj.length) {
            req.flash('danger', "user has not been registered");
            return res.redirect('/login');
        }

        const passwordMatch = await bcrypt.compare(password, obj[0].password);
        if (!passwordMatch) {
            req.flash('danger', 'password wrong');
            return res.redirect('/login');
        }

        req.session.isLogin = true;
        req.session.idUser = obj[0].idusersb;
        req.session.user = obj[0].name;
        req.flash('success', 'login success');
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        res.send('Terjadi kesalahan saat mengambil data pengguna.');
    }
}


function registerform(req, res) {
    res.render('register')
}

// handle add user into database
async function addUser(req, res) {
    try {
        const { name, email, password } = req.body

        await bcrypt.hash(password, 10, (err, hashPassword) => {
            const query = `INSERT INTO usersbs (email, password, name, "createdAt", "updatedAt") VALUES ('${email}', '${hashPassword}', '${name}', NOW(), NOW())`

            sequelize.query(query)
        })
        res.redirect('/loginform')
    } catch (err) {
        throw err
    }
}

function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.log(err);
        }
        res.redirect('/loginform');
    });
}

