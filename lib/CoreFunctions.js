const moment = require('moment');

function getNextThursdayAndFridayDates() {
    const startDate = moment().startOf('isoWeek').add(3, 'days');
    const endDate = moment(startDate).add(3, 'weeks');

    const thursdaysAndFridays = [];

    while (startDate.isBefore(endDate)) {
        if (startDate.isoWeekday() === 4) { // Thursday
            thursdaysAndFridays.push(startDate.clone());
        } else if (startDate.isoWeekday() === 5) { // Friday
            thursdaysAndFridays.push(startDate.clone());
        }
        startDate.add(1, 'day');
    }
    return thursdaysAndFridays;
}

module.exports={
    getNextThursdayAndFridayDates
}