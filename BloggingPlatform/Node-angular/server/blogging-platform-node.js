
import { postData } from '../../posts.js';
import { createServer } from 'http';
import { URL } from 'url';
import { readFile } from 'fs';

const options = {
    port: 3000
};

const server = createServer((req, res) => {
    let localPostData = postData;
    const parsedURL = new URL(req.url, `http://${req.headers.host}`);
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    if (parsedURL.pathname === '/') {
        readFile('../instructions.html', (err, data) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(data)            
        })
    } else if (req.method === 'GET' && parsedURL.pathname.startsWith('/api/posts')) {
        if (parsedURL.search !== "") {
            const searchTerm = parsedURL.searchParams.get('term');
            
            let data = localPostData.filter(post => {
                return (
                    post.category.includes(searchTerm) ||
                    post.content.includes(searchTerm) ||
                    post.title.includes(searchTerm)
                );
            }).sort((a, b) => a.id - b.id)
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
        } else {
            const pathArray = parsedURL.pathname.split('/');
            
            if (pathArray.length > 4) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'text/plain');
                res.end('Bad Request');
            } else {
                let data = localPostData;
                const postId = pathArray[3];
                
                if (postId) {
                    data = localPostData.filter(post => post.id === Number.parseInt(postId));
                }
                
                if (data.length > 0) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify(data));
                } else {
                    res.statusCode = 404;
                    res.end("404 Post not found")
                }
            }
        }
        
    } else if (req.method === 'POST' && parsedURL.pathname ===  '/api/posts') {
        let dataChunks = '';
        
        // stream data event listener - Get all emitted data
        req.on('data', chunk => dataChunks += chunk);
        
        // Indicate the body has been received and parse data
        req.on('end', () => {
            try {
                const data = JSON.parse(dataChunks);
                
                if (data.hasOwnProperty('title') &&
                data.hasOwnProperty('content') &&
                data.hasOwnProperty('tags') &&
                data.hasOwnProperty('category')) {
                    let dataId = localPostData[localPostData.length - 1].id + 1;
                    data.id = dataId;
                    localPostData.push(data);
                    
                    res.setHeader('Access-Control-Allow-Methods', '*');
                    res.statusCode = 201;
                    res.end(JSON.stringify(localPostData));
                } else {
                    res.statusCode = 400;
                    res.end('Bad Payload');
                }
            } catch (err) {
                res.statusCode = 400;
                res.end('error')
            }
        })
    } else if (req.method === 'DELETE' && parsedURL.pathname.startsWith('/api/posts')) {
        const pathArray = parsedURL.pathname.split('/');

        if (pathArray.length > 4) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Bad Request');
        } else {
            let dataIndex = -1;
            const postId = pathArray[3];

            if (postId) {
                dataIndex = localPostData.findIndex(post => post.id === Number.parseInt(postId));
            }

            if (dataIndex > -1) {
                let deleted = localPostData.splice(dataIndex, 1);

                res.statusCode = 204;
                res.setHeader('Content-Type', 'application/json');
                res.end('204 Post successfully deleted');
            } else {
                res.statusCode = 404;
                res.end("404 Post not found")
            }
        }
    } else if (req.method === 'PUT' && parsedURL.pathname.startsWith('/api/posts')) {
        const pathArray = parsedURL.pathname.split('/');

        if (pathArray.length > 3) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Bad Request');
        } else {
            let dataIndex = -1;
            let dataChunks = '';
            const postId = pathArray[2];

            if (postId) {
                dataIndex = localPostData.findIndex(post => post.id === Number.parseInt(postId));
            }

            if (dataIndex > -1) {
                // stream data event listener - Get all emitted data
                req.on('data', chunk => dataChunks += chunk);

                // Indicate the body has been received and parse data
                req.on('end', () => {
                    try {
                        const data = JSON.parse(dataChunks);

                        if (data.hasOwnProperty('title') ||
                            data.hasOwnProperty('content') ||
                            data.hasOwnProperty('tags') ||
                            data.hasOwnProperty('category')) {

                            localPostData[dataIndex] = { ...localPostData[dataIndex], ...data };

                            res.statusCode = 200;
                            res.end(JSON.stringify(localPostData[dataIndex]));
                        } else {
                            res.statusCode = 400;
                            res.end('Bad Payload');
                        }
                    } catch (err) {
                        res.statusCode = 400;
                        res.end('error')
                    }
                })
            } else {
                res.statusCode = 404;
                res.end("404 Post not found")
            }
        }
    } else {
        res.statusCode = 500;
        res.end('What are you doing buddy?');
    }
})

server.listen(options, () => {
    console.log(`Listening on port ${options.port}`)
})