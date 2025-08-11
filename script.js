document.addEventListener('DOMContentLoaded', () => {
    const dateInput = document.querySelector('input[name="lessonDate"]');
    const timeInput = document.querySelector('input[name="lessonTime"]');
  
    const sheetID = 'YOUR_SHEET_ID';       // Replace with your actual Sheet ID
    const sheetName = 'Sheet1';            // Replace with your actual sheet name
    const apiKey = 'YOUR_API_KEY';         // Replace with your actual API key
  
    // Generate 15-minute intervals within the hour after the booked time
    const generateBlockedTimes = (startTime) => {
      const blocked = [];
      const [hour, minute] = startTime.split(':').map(Number);
      const start = new Date();
      start.setHours(hour, minute, 0, 0);
  
      for (let i = 0; i <= 45; i += 15) {
        const slot = new Date(start.getTime() + i * 60000);
        const h = String(slot.getHours()).padStart(2, '0');
        const m = String(slot.getMinutes()).padStart(2, '0');
        blocked.push(`${h}:${m}`);
      }
  
      return blocked;
    };
  
    dateInput.addEventListener('change', () => {
      const selectedDate = dateInput.value;
  
      fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetID}/values/${sheetName}?key=${apiKey}`)
        .then(res => res.json())
        .then(data => {
          const rows = data.values || [];
  
          // Get all blocked times for selected date
          const blockedTimes = rows
            .filter(row => row[4] === selectedDate)
            .flatMap(row => generateBlockedTimes(row[5]));
  
          timeInput.addEventListener('input', () => {
            if (blockedTimes.includes(timeInput.value)) {
              alert('This time is unavailable. Please choose another.');
              timeInput.value = '';
            }
          });
        });
    });
  });