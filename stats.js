const binId = '69d503f0856a68218909f7f5';
const masterKey = '$2a$10$ZF6.ipuaKIsSjeq2V6Yd2O7h/csMCnFKZ4wGgFYb0mO5XKxX7okN2';
const jsonbinUrl = `https://api.jsonbin.io/v3/b/${binId}/latest`;

async function fetchData() {
    try {
        const res = await fetch(jsonbinUrl, {
            headers: {
                'X-Master-Key': masterKey
            }
        });
        const data = await res.json();
        return data.record || [];
    } catch (e) {
        console.error(e);
        return [];
    }
}

function countAnswers(data) {
    const stats = {};
    for (let i = 1; i <= 10; i++) stats[`问题${i}`] = {};
    stats['问题11'] = {};

    data.forEach(entry => {
        const answers = entry.answers;
        for (const [q, ans] of Object.entries(answers)) {
            stats[q][ans] = (stats[q][ans] || 0) + 1;
        }
    });

    return stats;
}

function renderStats(stats) {
    const container = document.getElementById('stats');
    container.innerHTML = '';

    for (const [q, counts] of Object.entries(stats)) {
        const table = document.createElement('table');
        const header = table.insertRow();
        header.insertCell().textContent = q;
        header.insertCell().textContent = '人数';

        for (const [option, num] of Object.entries(counts)) {
            const row = table.insertRow();
            row.insertCell().textContent = option;
            row.insertCell().textContent = num;
        }

        container.appendChild(table);
    }
}

async function main() {
    const data = await fetchData();
    const stats = countAnswers(data);
    renderStats(stats);
}

main();