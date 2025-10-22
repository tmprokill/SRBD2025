-- noinspection SqlNoDataSourceInspectionForFile
CREATE DATABASE Lab1;
GO
USE Lab1;
GO

CREATE TABLE Readers
(
    ReaderID INT          NOT NULL IDENTITY(1,1) PRIMARY KEY,
    FullName VARCHAR(50)  NOT NULL,
    Address  VARCHAR(100) NULL,
    Phone    VARCHAR(20)  NULL
);

CREATE TABLE Genres
(
    GenreID     INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
    GenreName   VARCHAR(100)  NOT NULL UNIQUE,
    Description NVARCHAR(200) NULL
);

CREATE TABLE Authors
(
    AuthorID  INT          NOT NULL IDENTITY(1,1) PRIMARY KEY,
    Pseudonym VARCHAR(100) NULL,
    FirstName VARCHAR(100) NOT NULL,
    LastName  VARCHAR(100) NOT NULL,
);

CREATE TABLE Books
(
    BookID      INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
    Title       VARCHAR(100)  NOT NULL,
    AuthorID    int           NOT NULL FOREIGN KEY REFERENCES Authors(AuthorID),
    GenreID     int NULL FOREIGN KEY REFERENCES Genres(GenreID),
    Price       DECIMAL(8, 2) NOT NULL,
    Quantity    INT           NOT NULL,
    Description NVARCHAR(200) NULL
);

CREATE TABLE Borrowings
(
    BorrowID   INT  NOT NULL IDENTITY(1,1) PRIMARY KEY,
    ReaderID   INT  NOT NULL FOREIGN KEY REFERENCES Readers(ReaderID),
    BookID     INT  NOT NULL FOREIGN KEY REFERENCES Books(BookID),
    BorrowDate DATE NOT NULL,
    ReturnDate DATE NULL,
    Quantity   INT  NOT NULL,
);

CREATE TABLE Sales
(
    SaleID   INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
    ReaderID INT           NOT NULL FOREIGN KEY REFERENCES Readers(ReaderID),
    BookID   INT           NOT NULL FOREIGN KEY REFERENCES Books(BookID),
    SaleDate DATE          NOT NULL,
    Quantity INT           NOT NULL,
    Price    Decimal(8, 2) NOT NULL
);

CREATE TABLE SalesLogs
(
    Id          INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
    SaleID      INT           NOT NULL,
    NewQuantity INT           NOT NULL,
    NewPrice    DECIMAL(8, 2) NOT NULL,
    ModifyDate  datetime      NOT NULL
);

CREATE TABLE BookCopy
(
    BookCopyID INT           NOT NULL IDENTITY(1,1) PRIMARY KEY,
    BookID     INT           NOT NULL,
    Title      VARCHAR(100)  NOT NULL,
    AuthorID   int           NOT NULL FOREIGN KEY REFERENCES Authors(AuthorID),
    GenreID    int NULL FOREIGN KEY REFERENCES Genres(GenreID),
    OldPrice   DECIMAL(8, 2) NOT NULL,
    NewPrice   DECIMAL(8, 2) NOT NULL,
);


INSERT INTO Genres (GenreName, Description)
VALUES ('Поезія', N'Збірки віршів та поем'),
       ('Роман', N'Великі прозові твори'),
       ('Фантастика', N'Наукова і фентезійна література'),
       ('Історія', N'Історичні книги та хроніки'),
       ('Детектив', N'Розслідування, загадки та кримінальні сюжети');

INSERT INTO Authors (Pseudonym, FirstName, LastName)
VALUES (NULL, 'Тарас', 'Шевченко'),
       (NULL, 'Іван', 'Франко'),
       (NULL, 'Ліна', 'Костенко'),
       ('Марк Твен', 'Семюел', 'Клеменс'),
       (NULL, 'Артур', 'Конан Дойл');

INSERT INTO Readers (FullName, Address, Phone)
VALUES ('Іваненко Петро', 'Київ, вул. Шевченка, 12', '0671234567'),
       ('Петренко Марія', 'Львів, вул. Франка, 8', '0939876543'),
       ('Коваль Андрій', 'Одеса, вул. Дерибасівська, 1', '0505551122'),
       ('Сидоренко Олена', 'Харків, вул. Сумська, 21', '0971122334'),
       ('Бондар Ігор', 'Дніпро, вул. Центральна, 45', '0954455667');

INSERT INTO Books (Title, AuthorID, GenreID, Price, Quantity, Description)
VALUES ('Кобзар', 1, 1, 150.00, 10, N'Збірка віршів'),
       ('Захар Беркут', 2, 2, 200.00, 7, N'Історичний роман'),
       ('Маруся Чурай', 3, 2, 180.00, 5, N'Українська класика'),
       ('Пригоди Тома Сойєра', 4, 3, 250.00, 6, N'Класика світової літератури'),
       ('Шерлок Холмс: Етюд у багряних тонах', 5, 5, 300.00, 4, N'Перший роман про Шерлока Холмса');

INSERT INTO Borrowings (ReaderID, BookID, BorrowDate, ReturnDate, Quantity)
VALUES (1, 1, '2025-10-01', NULL, 1),         -- Петро взяв "Кобзар"
       (2, 3, '2025-09-28', '2025-10-05', 1), -- Марія брала "Маруся Чурай"
       (3, 2, '2025-09-30', NULL, 2),         -- Андрій взяв два примірники "Захар Беркут"
       (4, 5, '2025-09-25', NULL, 1),         -- Олена читає "Шерлок Холмс"
       (5, 4, '2025-10-02', NULL, 1); -- Ігор взяв "Пригоди Тома Сойєра"

INSERT INTO Sales (ReaderID, BookID, SaleDate, Quantity, Price)
VALUES (1, 2, '2025-01-10', 2, 200.00),
       (2, 2, '2025-02-05', 1, 200.00),
       (3, 2, '2025-02-10', 3, 200.00),
       (1, 3, '2025-03-02', 1, 180.00),
       (4, 3, '2025-03-12', 2, 180.00),

       (2, 4, '2025-03-25', 1, 250.00),
       (5, 4, '2025-03-28', 2, 250.00),

       (3, 5, '2025-04-01', 2, 300.00),
       (4, 5, '2025-04-05', 3, 300.00),
       (5, 5, '2025-04-06', 1, 300.00)

--Procedures
--Процедура, для додавання авторів в відповідну таблицю
GO
CREATE OR ALTER PROCEDURE usp_Insert_Into_Authors
    @Pseudonym VARCHAR(100) = NULL,
    @FirstName VARCHAR(100),
    @LastName  VARCHAR(100)
AS
BEGIN
    INSERT INTO dbo.Authors
    VALUES(@Pseudonym, @FirstName, @LastName)
END

-- Процедура для оренди книги за певною кількістю – занесення даних у таблицю [Borrowings] 
-- У разі занесення товару що не існує, або кількості яка більше за наявну виводити повідомлення.
GO
CREATE OR ALTER PROCEDURE usp_Add_New_Borrowing
    @ReaderID int,
    @BookID int,
    @Quantity int
AS
BEGIN
    IF ((SELECT COUNT(BookID) FROM dbo.Books WHERE BookID = @BookID) = 0)
        BEGIN
            RAISERROR('Немає книги з ID: %d', 16, 1, @BookID);
        END;
    ELSE IF(@Quantity > (SELECT Quantity FROM dbo.Books WHERE BookID = @BookID))
        BEGIN
            RAISERROR('Кількість, що ви намагаєтесь орендувати перевищує наявність.', 16, 1);
        END;

    --Додавання нового запису
    INSERT INTO dbo.Borrowings (ReaderID, BookID, BorrowDate, ReturnDate, Quantity)
    VALUES(@ReaderID, @BookID, CONVERT(date, GETDATE(), 101), NULL, @Quantity);
    --Зміна кількості книг
    UPDATE dbo.Books
    SET Quantity = (Quantity - @Quantity)
    WHERE BookID = @BookID;

    PRINT('Оренда книги успішна.');
    return 0;
END

--Процедура для повернення книги
GO
CREATE OR ALTER PROCEDURE usp_FinalizeBorrowing
@BorrowId int
AS
BEGIN
    IF ((SELECT COUNT(BookID) FROM dbo.Borrowings WHERE BorrowID = @BorrowId) = 0)
        BEGIN
            RAISERROR('Немає оренди з ID: %d', 16, 1, @BorrowId);
        END;

    --Повернення оренди
    UPDATE dbo.Borrowings SET ReturnDate = CONVERT(date, GETDATE(), 101)
    WHERE BorrowID = @BorrowId;

    --Зміна кількості книг
    DECLARE @QuantityOfReturned int = (SELECT Quantity FROM dbo.Borrowings WHERE BorrowID = @BorrowId);
    DECLARE @BookId int = (SELECT BookID FROM dbo.Borrowings WHERE BorrowID = @BorrowId);

    UPDATE dbo.Books
    SET Quantity = (Quantity + @QuantityOfReturned)
    WHERE BookID = @BookID;

    PRINT('Закриття оренди успішно.');
    return 0;
END

-- Індивідуальні заняття
-- 9) Розробіть процедуру, що для товарів із заданого відділу, ціна яких
-- належіть до 25% найдорожчих товарів, в полі Description записує «Дорогий
-- товар», а для товарів з ціною, яка знаходиться в діапазоні 25% найдешевших
-- товарів – «Дешевий товар» (необхідно визначити мінімальну та максимальну
-- ціну товарів, розбити цей діапазон на 3 частини – 25%, 50% 25% та для першої
-- та останньої групи товарів в полі Description дописати відповідну інформацію);

GO
CREATE OR ALTER PROCEDURE usp_UpdateBookDescriptions_ByPrice
AS
BEGIN
    DECLARE
        @MinPrice DECIMAL(8,2),
        @MaxPrice DECIMAL(8,2),
        @Range DECIMAL(8,2),
        @LowThreshold DECIMAL(8,2),
        @HighThreshold DECIMAL(8,2);

    SELECT
        @MinPrice = MIN(Price),
        @MaxPrice = MAX(Price)
    FROM dbo.Books;

    SET @Range = @MaxPrice - @MinPrice;
    SET @LowThreshold = @MinPrice + @Range * 0.25;
    SET @HighThreshold = @MinPrice + @Range * 0.75;

    UPDATE dbo.Books
    SET Description = 'Дешевий товар'
    WHERE Price <= @LowThreshold;

    UPDATE dbo.Books
    SET Description = 'Дорогий товар'
    WHERE Price >= @HighThreshold;

    PRINT 'Описи оновлені успішно.';
END;

--Procedures with cursor
--4) Створити функцію, зменшує ціну товарів на вказаний відсоток (слід
--обмежити значення відсотку в діапазоні від 1 до 50, інакше - помилка)
--для товарів, яких було продано на загальну суму більше ніж вказано як
--другий параметр. Також функція має повертати дані про товари, для
--яких відбулось зниження ціни у вигляді: Назва товару, стара ціна, нова
--ціна, загальна кількість товарів.

GO
CREATE OR ALTER PROCEDURE sp_CutThePrice
    @Percent INT,
    @MinSalesValue INT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE
        @BookId INT,
        @BookTitle NVARCHAR(100),
        @OldPrice DECIMAL(8,2),
        @NewPrice DECIMAL(8,2),
        @TotalSold INT,
        @TotalRevenue DECIMAL(8,2);

    IF (@Percent < 1 OR @Percent > 50)
        BEGIN
            RAISERROR('The percent is out of range (1,50)', 16, 1);
        END

    CREATE TABLE #Result (
                             BookTitle NVARCHAR(100),
                             OldPrice DECIMAL(8,2),
                             NewPrice DECIMAL(8,2),
                             TotalSold INT,
                             TotalRevenue DECIMAL(8,2)
    );

    DECLARE book_cursor CURSOR LOCAL FAST_FORWARD FOR
        SELECT
            b.BookID,
            b.Title,
            b.Price AS CurrentPrice,
            SUM(s.Quantity) AS TotalQuantitySold,
            SUM(s.Quantity * s.Price) AS TotalRevenue
        FROM dbo.Sales s
                 INNER JOIN dbo.Books b ON s.BookID = b.BookID
        GROUP BY b.BookID, b.Title, b.Price
        HAVING SUM(s.Quantity * s.Price) > @MinSalesValue
        ORDER BY b.Title;

    OPEN book_cursor;

    FETCH NEXT FROM book_cursor INTO @BookId, @BookTitle, @OldPrice, @TotalSold, @TotalRevenue;

    WHILE @@FETCH_STATUS = 0
        BEGIN
            SET @NewPrice = @OldPrice - (@OldPrice * @Percent / 100.00);

            UPDATE dbo.Books
            SET Price = @NewPrice
            WHERE BookID = @BookId;

            INSERT INTO #Result (BookTitle, OldPrice, NewPrice, TotalSold, TotalRevenue)
            VALUES (@BookTitle, @OldPrice, @NewPrice, @TotalSold, @TotalRevenue);

            FETCH NEXT FROM book_cursor INTO @BookId, @BookTitle, @OldPrice, @TotalSold, @TotalRevenue;
        END

    CLOSE book_cursor;
    DEALLOCATE book_cursor;

    SELECT
        BookTitle,
        OldPrice,
        NewPrice,
        TotalSold,
        TotalRevenue
    FROM #Result
    ORDER BY BookTitle;

    DROP TABLE #Result;
END;

--Functions
-- Написати функцію для таблиці Books підрахувати кількість рядків із значенням поля Price більше середнього. 
GO
CREATE OR ALTER FUNCTION count_greater_than_avg_price()
    RETURNS INT
AS
BEGIN
    DECLARE @RowCount INT;

    SET @RowCount = (
        SELECT COUNT(*)
        FROM dbo.Books
        WHERE Price > (SELECT AVG(Price) FROM dbo.Books)
    );

    RETURN @RowCount;
END;

-- Написати функцію для таблиці Books щоб знайти кількість рядків 
-- із значенням поля Price більше параметру що приходить до функції. 
GO
CREATE OR ALTER FUNCTION count_books_more_price_than
(
    @new_price INT
)
    RETURNS INT
AS
BEGIN
    DECLARE @temp_count INT;

    SET @temp_count = (
        SELECT COUNT(*)
        FROM dbo.Books
        WHERE Price > @new_price
    );

    RETURN @temp_count;
END;

-- Адаптоване завдання: Створити функцію, що за параметром назвою міста, повертає кількість читачів з цього міста
GO
CREATE OR ALTER FUNCTION CountReadersFromCity
(
    @CityName varchar
)
    RETURNS INT
AS
BEGIN
    DECLARE @result_count INT;

    SET @result_count = (
        SELECT COUNT(*) FROM dbo.Readers
        WHERE Address LIKE ('%' + @CityName + '%')
    )

    RETURN @result_count;
END;

--Functions with cursors 
GO
CREATE OR ALTER FUNCTION fn_GetEverySecondPopularBook (@MinQuantity INT)
    RETURNS @ResultTable TABLE (
                                   BookTitle NVARCHAR(100),
                                   TotalSold INT,
                                   AuthorFullName NVARCHAR(200)
                               )
AS
BEGIN
    DECLARE
        @BookTitle NVARCHAR(100),
        @TotalSold INT,
        @AuthorFullName NVARCHAR(200),
        @RowIndex INT = 0;

    DECLARE book_cursor CURSOR LOCAL STATIC READ_ONLY FOR
        SELECT b.Title,
               SUM(s.Quantity)                  AS TotalSold,
               (a.FirstName + ' ' + a.LastName) AS AuthorFullName
        FROM Sales s
                 INNER JOIN Books b ON s.BookID = b.BookID
                 INNER JOIN Authors a ON b.AuthorID = a.AuthorID
        GROUP BY b.Title, a.FirstName, a.LastName
        HAVING SUM(s.Quantity) > @MinQuantity
        ORDER BY b.Title;

    OPEN book_cursor;

    FETCH NEXT FROM book_cursor INTO @BookTitle, @TotalSold, @AuthorFullName;

    WHILE @@FETCH_STATUS = 0
        BEGIN
            SET @RowIndex += 1;
            IF (@RowIndex % 2 = 0)
                BEGIN
                    INSERT INTO @ResultTable
                    VALUES (@BookTitle, @TotalSold, @AuthorFullName);
                END

            FETCH NEXT FROM book_cursor INTO @BookTitle, @TotalSold, @AuthorFullName;
        END;

    CLOSE book_cursor;
    DEALLOCATE book_cursor;

    RETURN;
END;

--Triggers
GO
CREATE OR ALTER TRIGGER tr_SalesLoging
    ON dbo.Sales
    AFTER INSERT, UPDATE
    AS
BEGIN
    INSERT dbo.SalesLogs(SaleId, NewQuantity, NewPrice, ModifyDate)
    VALUES ((SELECT SaleId FROM inserted), (SELECT Quantity FROM inserted), (SELECT Price From inserted), GETDATE())
END

GO
CREATE OR ALTER TRIGGER tr_Create_Sales_During_Not_Working_Hours
    ON dbo.Sales
    INSTEAD OF INSERT
    AS
BEGIN
    IF ((datepart(dw,getdate()) = 7) OR datepart(dw,getdate()) = 1)
        BEGIN
            RAISERROR ('You cannot modify sales in not working days', 16, 1)
        END
    ELSE IF (((datepart(HOUR,getdate()) < 9)) OR ((datepart(HOUR,getdate()) > 18)))
        BEGIN
            RAISERROR ('You cannot modify sales in not working hours', 16, 1)
        END
    ELSE
        BEGIN
            INSERT INTO Sales (ReaderID, BookID, SaleDate, Quantity, Price)
            SELECT ReaderID, BookID, SaleDate, Quantity, Price
            FROM inserted
        END
END

GO
CREATE SEQUENCE BookUpdateCounterSeq
    START WITH 1
    INCREMENT BY 1;

GO
CREATE TRIGGER trg_CopyEveryThirdBookUpdate
    ON Books
    AFTER UPDATE
    AS
BEGIN
    SET NOCOUNT ON;

    IF UPDATE(Price)
        BEGIN
            DECLARE @Counter INT;

            SET @Counter = NEXT VALUE FOR BookUpdateCounterSeq;

            IF (@Counter % 3 = 0)
                BEGIN
                    INSERT INTO BookCopy (BookID, Title, AuthorID, GenreID, OldPrice, NewPrice)
                    SELECT
                        i.BookID,
                        i.Title,
                        i.AuthorID,
                        i.GenreID,
                        d.Price AS OldPrice,
                        i.Price AS NewPrice
                    FROM inserted i
                             INNER JOIN deleted d ON i.BookID = d.BookID
                    WHERE i.Price <> d.Price;
                END
        END
END