// imports
const exp = require('express')
const cors = require('cors')
const SQL = require('./dbconfig')

// inits
const app = exp()

// middlewares
app.use(exp.json())
app.use(cors())

// endpoints
app.get('/menu', async (req, res) => {
    try {
        const menu = await SQL(`SELECT * FROM menu`)
        console.table(menu)
        res.send(menu)
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

app.get('/customers', async (req, res) => {
    try {
        const customers = await SQL(`SELECT * FROM customers`)
        console.table(customers)
        res.send(customers)
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

app.get('/order/:userid', async (req, res) => {
    try {
        const orders = await SQL(`SELECT customers.name as customer,
        customers.membership,
        menu.name as dish,
        menu.price,
        menu.img
        FROM orders
        INNER JOIN customers on orders.user_id = customers.id
        INNER JOIN menu on orders.dish_id = menu.id
        WHERE orders.user_id = ${req.params.userid}`)
        console.table(orders)
        res.send(orders)
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

app.post('/order', async (req, res) => {
    try {
        const { user_id, dish_id } = req.body

        if (!user_id || !dish_id) {
            return res.status(400).send({ err: "missing info" })
        }

        await SQL(`INSERT INTO orders (user_id, dish_id)
        VALUES (${user_id}, ${dish_id})`)

        res.send({ msg: "order created" })

    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})

app.delete('/pay/:userid', async (req, res) => {
    try {
        const { userid } = req.params
        await SQL(`DELETE FROM orders WHERE user_id = ${userid}`)
        res.send({ msg: "payment accepted" })
    } catch (err) {
        console.log(err);
        res.sendStatus(500)
    }
})


// listen
app.listen(1000, _ => console.log("rocking'1000"))
