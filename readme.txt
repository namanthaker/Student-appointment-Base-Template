-----------------------Unprotected Routes-----------------------

/student/login [POST]
/dean/login [POST]

Both takes json as body:
{
    "username":"s01",
    "password":"password"
}

-----------------------Protected Student Routes-------------------------------
Only student session can access this.
Pass session token as a bearer auth header.

/student/book-appointment [POST]
{
    "deanId":"d01", 
    "date" : "18-08-2023"
}

/student/available-dates [GET]
{
    "deanId" : "d01"
}
fetch dates for next 3 weeks
Output : {"dates-available":["17-08-2023","24-08-2023","25-08-2023","31-08-2023","01-09-2023"]}

----------------------Protected Dean Routes ------------------------------------
Only dean session can access this.
Pass session token as a bearer auth header.

/dean/appointments [GET]
Returns all booked apointments for the dean with current session.
{
    "count": 1,
    "reserved": [
        {
            "id": 1,
            "deans_id": "d01",
            "student_id": "s01",
            "date": "18-08-2023",
            "time": "10:00:00",
            "reserved_at": "2023-08-14T03:05:08.000Z",
            "student_name": "Student A"
        }
    ]
}