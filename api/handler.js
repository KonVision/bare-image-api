/* Importing packages */
const chokidar = require('chokidar');
const fs = require('fs');


/* Call watcher */
let watcher = chokidar.watch('/var/www/flows.host/upload/end/', {ignored: /^\./, persistent: true});

watcher
    .on('add', function(path) {console.log('File', path, 'has been added'); postProc(path);})

function postProc(filename) {

    const change = filename;
    const postproc = change.split('/www/flows.host/upload/end').pop();
    const end = postproc.replace('/','').split('.');

    let user = end[0];
    let newfile = end[1] + '.' + end[2];

    fs.mkdirSync('/var/www/flows.host/users/' + user + '/' + end[1]);

    fs.rename('/var/www/flows.host/upload/end/' + postproc.replace('/','') , '/var/www/flows.host/users/' + user + '/' + end[1] + '/' + newfile , (end) => {
	console.log("moved")
    });

    const content = `<html> <head> <meta property="og:title" content="${user}" /> <meta name="twitter:card" content="summary_large_image"> <meta property="og:type" content="image" /> <meta name="twitter:image" content="https://flows.host/users/${user}/${end[1]}/${newfile}" /> <meta property="og:url" content="https://flows.host/users/${user}/" /> <script src="https://cdn.tailwindcss.com"></script> </head> <style> body { height: 75vh; background: #1f2329; color: #ffffff; } @media screen and (min-height: 700px) { .div { margin-top: 12.5%;} } @media screen and (max-height: 701px) { .div { margin: 10px; } } img { width: 50%; } </style> <body> <div class="div"> <img class="mx-auto p-4 md:p-0" src="${newfile}"> <h1 class="text-xl md:text-2xl font-bold text-center p-1"> Uploader: ${user} </h1> </div> </body> </html>`;

    fs.writeFile('/var/www/flows.host/users/' + user + '/' + end[1] + '/' + end[1] + '.html', content, err => {
        if (err) {
	    console.error(err);
        }
    });

    console.log("user=" + user + "; file =" + newfile + "; end=" + end + "postproc =" + postproc);

}
