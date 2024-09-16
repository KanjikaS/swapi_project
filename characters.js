document.addEventListener('DOMContentLoaded', () => {
    const characterUrls = JSON.parse(localStorage.getItem('characterUrls'));  
    const characterList = document.getElementById('character-list');

    if (!characterUrls || characterUrls.length === 0) {
        characterList.textContent = 'No characters found';
        return;
    }

   const fetchCharacterNames = characterUrls.map(url => fetch(url).then(response => response.json()));

    Promise.all(fetchCharacterNames)
        .then(characters => {
            characters.forEach(character => {
                const li = document.createElement('li');
                li.textContent = character.name; 
                characterList.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Error fetching character data:', error);
            characterList.textContent = 'Error loading characters';
        });
});
