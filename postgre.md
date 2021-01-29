## validation
	numbers without decimal points:
		- smallint, integer, biginteger

	no, decimal point auto increment:
		- smallserial, serial, bigserial

	numbers with decimal points:
		- decimal, numeric, real, double precision, float

	BOOLEAN:
		- true, yes, on, 1, t, y
		- false, no, off, 0, f, n
		- NULL

	INTERVEL(duration of time):
		day -> day, D -> day, D M S -> day minute second

	examples:
		(10::INTEGER) -> integer type
		('10 nov 2001'::DATE) -> date type
		('10:23 PM'::TIME) -> time type


### CHECK
	A check can only work on the row we are adding/updating.
	syntax:
		create table tablename(
			column1 serial primary key,
			column2 integer CHECK (column2 > 0)
		);

### schema designer tools
	- dbdiagram.io
	- drawsql.app
	- sqldbm.com
	- quickdatabasediagrams.com
	- ondras.zarovi.cz/sql/demo

### design a like system
	
	use diffrent table for reaction and add id's of user and post and type of reaction this would be flexible and easy to maintain. relationship between post and the user.
	