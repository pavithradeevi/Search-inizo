
document.getElementById('searchButton').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;

    fetch(`/search?query=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            const resultsContainer = document.getElementById('results');
            resultsContainer.innerHTML = ''; 
            window.searchResults = []; 

            if (data.length > 0) {
                data.forEach(item => {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('result-item');
                    resultItem.innerHTML = `<h3><a href="${item.link}" target="_blank">${item.title}</a></h3><p>${item.snippet}</p>`;
                    resultsContainer.appendChild(resultItem);
                    window.searchResults.push(item); 
                });
                document.getElementById('saveButton').style.display = 'block'; 
            } else {
                resultsContainer.innerHTML = '<p>No results found.</p>';
                document.getElementById('saveButton').style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error fetching search results:', error);
            document.getElementById('results').innerHTML = '<p>Error fetching results. Please try again later.</p>';
        });
});


document.getElementById('saveButton').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.searchResults));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = 'search_results.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    document.getElementById('saveButton').style.display = 'none';
});

document.getElementById('searchInput').addEventListener('input', function() {
    document.getElementById('saveButton').style.display = 'none';
});
