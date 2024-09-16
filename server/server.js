const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 3000;


app.use(express.json());


app.get('/:endpoint', (req, res) => {
    const endpoint = req.params.endpoint
    const filePath = path.join(__dirname, `database/${endpoint}.json`);

    

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).send('Server error');
        }

      
        res.json(JSON.parse(data));
    });
});


app.get('/:endpoint/:pk', (req, res) => {
    const endpoint = req.params.endpoint
    const filePath = path.join(__dirname, `database/${endpoint}.json`);
    const planetPk = parseInt(req.params.pk, 10);  

   
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).send('Server error');
        }

        const planets = JSON.parse(data);  
        const planet = planets.find(p => p.pk === planetPk);  

        if (planet) {
            res.json(planet);
        } else {
            
            res.status(404).send('Planet not found');
        }
    });
});

app.post('/:endpoint', (req, res) => {
    const endpoint = req.params.endpoint
    const filePath = path.join(__dirname, `database/${endpoint}.json`);
    const newPlanetData = req.body;  

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).send('Server error');
        }

        const planets = JSON.parse(data); 

        const lastPk = planets.length > 0 ? planets[planets.length - 1].pk : 0;
        const newPk = lastPk + 1;
        const newPlanet = {
            fields: {
                ...newPlanetData.fields,
                created: new Date().toISOString(),  
                edited: new Date().toISOString() 
            },
            model: `resources.${endpoint}`,  
            pk: newPk  
        };

        planets.push(newPlanet);

        
        fs.writeFile(filePath, JSON.stringify(planets, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing the file:', writeErr);
                return res.status(500).send('Server error');
            }
            res.status(201).json(newPlanet);
        });
    });
});


app.delete('/:endpoint/:pk', (req, res) => {
    const endpoint = req.params.endpoint
    const planetPk = parseInt(req.params.pk, 10);
    const filePath = path.join(__dirname, `database/${endpoint}.json`);

    
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file:', err);
            return res.status(500).send('Server error');
        }

        let planets = JSON.parse(data);  

        const planetIndex = planets.findIndex(p => p.pk === planetPk);

        if (planetIndex === -1) {
            return res.status(404).send(`${endpoint} not found`);
        }

    
        planets.splice(planetIndex, 1);

        // Write the updated planets array back to the JSON file
        fs.writeFile(filePath, JSON.stringify(planets, null, 2), (writeErr) => {
            if (writeErr) {
                console.error('Error writing the file:', writeErr);
                return res.status(500).send('Server error');
            }

            // Send a success response
            res.status(200).send(`${endpoint} with pk ${planetPk} deleted successfully`);
        });
    });
});





app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
