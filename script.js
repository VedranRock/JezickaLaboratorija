document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.querySelector('input[name="lessonDate"]');
    const timeInput = document.querySelector('input[name="lessonTime"]');
  
    const sheetID = 'YOUR_SHEET_ID';
    const sheetName = 'Sheet1';
    const apiKey = 'YOUR_API_KEY';
  
    dateInput.addEventListener('change', () => {
      const selectedDate = dateInput.value;
  
      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`)
        .then(res => res.json())
        .then(data => {
          const rows = data.values || [];
          const bookedTimes = rows
            .filter(row => row[4] === selectedDate)
            .map(row => row[5]);
  
          timeInput.addEventListener('input', () => {
            if (bookedTimes.includes(timeInput.value)) {
              alert('This time is already booked.');
              timeInput.value = '';
            }
          });
        });
    });
  });