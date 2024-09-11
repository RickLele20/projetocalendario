document.addEventListener('DOMContentLoaded', function() {
    // Código do calendário
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    const daysContainer = document.getElementById('days');
    const monthYearElement = document.getElementById('month-year');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');

    let currentDate = new Date();

    // Lista de feriados (exemplo)
    const holidays = [
        { month: 0, day: 1, name: "Ano Novo" },       // 1 de Janeiro
        { month: 4, day: 1, name: "Dia do Trabalho" }, // 1 de Maio
        { month: 11, day: 25, name: "Natal" }          // 25 de Dezembro
        // Adicione mais feriados conforme necessário
    ];

    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();

        monthYearElement.textContent = `${monthNames[month]} ${year}`;

        daysContainer.innerHTML = '';

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        for (let i = 0; i < firstDay; i++) {
            const emptyDiv = document.createElement('div');
            daysContainer.appendChild(emptyDiv);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayDiv = document.createElement('div');
            dayDiv.textContent = i;

            if (i === date.getDate() && year === new Date().getFullYear() && month === new Date().getMonth()) {
                dayDiv.classList.add('today');
            }

            // Verifica se o dia é um feriado
            const isHoliday = holidays.some(holiday => 
                holiday.month === month && holiday.day === i
            );

            if (isHoliday) {
                dayDiv.classList.add('holiday');
                dayDiv.title = holidays.find(holiday => 
                    holiday.month === month && holiday.day === i
                ).name;
            }

            daysContainer.appendChild(dayDiv);
        }
    }

    prevMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    nextMonthButton.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });

    renderCalendar(currentDate);

    // Código para comentários
    const commentForm = document.getElementById('commentForm');
    const commentList = document.querySelector('.comment-list');
    const commentSection = document.querySelector('.comment-section'); // Referência à seção de comentários

    commentForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio padrão do formulário

        const formData = new FormData(commentForm);

        // Envia os dados do formulário via AJAX
        fetch('send_comment.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            if (data === 'success') {
                // Se o envio for bem-sucedido, adiciona o novo comentário à lista
                const commentText = formData.get('comment');
                const email = formData.get('email');

                const commentDiv = document.createElement('div');
                commentDiv.classList.add('comment');
                commentDiv.innerHTML = `
                    <p>${commentText}</p>
                    <div class="email">${email}</div>
                `;

                commentList.appendChild(commentDiv);

                // Limpa o formulário após o envio
                commentForm.reset();

                // Oculta a seção de comentários
                commentSection.style.display = 'none';
            }
        });
    });
});