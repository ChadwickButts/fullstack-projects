import { postData } from '../../posts';
import express from 'express';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(new URL('../instructions.html', import.meta.url));
const __dirname = dirname(__filename);
const localPostData = postData;

const app = express()
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'instructions.html'));
})

app.get('/posts/:postId', (req, res) => {
    let data = localPostData;
    const { postId } = req.params;

    if (postId) {
        data = localPostData.filter(post => post.id === Number.parseInt(postId));
    }

    if (data.length > 0) {
        res.status(200).json(data);
    } else {
        res.status(404).end("404 Post not found")
    }
})

app.route('/posts')
    .get((req, res) => {
        res.status(200).json(localPostData);
    })
    .post((req, res) => {
        const data = req.body;

        if (data.hasOwnProperty('title') &&
            data.hasOwnProperty('content') &&
            data.hasOwnProperty('tags') &&
            data.hasOwnProperty('category')) {
            let dataId = localPostData[localPostData.length - 1].id + 1;
            data.id = dataId;
            localPostData.push(data);

            res.status(201).send(localPostData);
        } else {
            res.status(400).send('Bad Payload');
        }
    })

app.put('/posts/:postId', (req, res) => {
    let dataIndex = -1;
    const { postId } = req.params;

    if (postId) {
        dataIndex = localPostData.findIndex(post => post.id === Number.parseInt(postId));
    }

    if (dataIndex > -1) {
        const data = req.body;
        if (data.hasOwnProperty('title') ||
            data.hasOwnProperty('content') ||
            data.hasOwnProperty('tags') ||
            data.hasOwnProperty('category')) {
            localPostData[dataIndex] = { ...localPostData[dataIndex], ...data };
            res.status(200).json(localPostData[dataIndex]);
        } else {
            res.status(400).send('Bad Payload');
        }
    } else {
        res.status(404).send("404 Post not found");
    }
})


app.delete('/posts/:postId', (req, res) => {
    let dataIndex = -1;
    const { postId } = req.params;

    if (postId) {
        dataIndex = localPostData.findIndex(post => post.id === Number.parseInt(postId));
    }

    if (dataIndex > -1) {
        let deleted = localPostData.splice(dataIndex, 1);

        res.status(204).send('204 Post successfully deleted');
    } else {
        res.statusCode = 404;
        res.end("404 Post not found")
    }
})

app.listen(port, () => {
    console.log(`Express listening on port ${port}`)
})