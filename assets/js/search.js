document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('docs-search');
    const searchResults = document.getElementById('search-results');
    const docSections = document.querySelectorAll('.docs-content section');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            
            if (query.length < 2) {
                if (searchResults) searchResults.style.display = 'none';
                return;
            }

            // Simple search logic
            const matches = Array.from(docSections).filter(section => {
                const text = section.innerText.toLowerCase();
                return text.includes(query);
            });

            if (searchResults) {
                searchResults.innerHTML = '';
                if (matches.length > 0) {
                    searchResults.style.display = 'block';
                    matches.forEach(match => {
                        const h2 = match.querySelector('h2');
                        const resultItem = document.createElement('div');
                        resultItem.className = 'search-result-item';
                        resultItem.innerHTML = `
                            <a href="#${match.id}">
                                <strong>${h2 ? h2.innerText : 'Section'}</strong>
                                <p>${match.innerText.substring(0, 100)}...</p>
                            </a>
                        `;
                        searchResults.appendChild(resultItem);
                    });
                } else {
                    searchResults.innerHTML = '<p style="padding: 1rem;">No results found.</p>';
                }
            }
        });
    }
});
