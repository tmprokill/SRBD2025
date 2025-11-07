import "./App.css";
import { Route, Routes } from "react-router";
import HomePage from "./features/home/components/homepage";
import { Header } from "./components/layout/header/header";
import ReaderDetailsPage from "./features/readers/pages/ReaderDetailsPage";
import ReadersDashboardPage from "./features/readers/pages/ReadersDashboardPage";
import ReaderFormPage from "./features/readers/pages/ReaderFormPage";
import BooksDashboardPage from "./features/books/pages/BooksDashboardPage";
import BookDetailsPage from "./features/books/pages/BookDetailsPage";
import BookFormPage from "./features/books/pages/BookFormPage";
import BorrowingsDashboardPage from "./features/borrowings/pages/BorrowingsDashboardPage";
import BorrowingFormPage from "./features/borrowings/pages/BorrowingFormPage";
import SalesDashboardPage from "./features/sales/pages/SalesDashboardPage";
import SaleFormPage from "./features/sales/pages/SaleFormPage";

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/readers" element={<ReadersDashboardPage />} />
            <Route path="/readers/:readerId" element={<ReaderDetailsPage />} />
            <Route path="/readers/add" element={<ReaderFormPage />} />
            <Route path="/readers/edit/:readerId" element={<ReaderFormPage />} />
            <Route path="/books" element={<BooksDashboardPage />} />
            <Route path="/books/:bookId" element={<BookDetailsPage />} />
            <Route path="/books/add" element={<BookFormPage />} />
            <Route path="/books/edit/:bookId" element={<BookFormPage />} />
            <Route path="/borrowings" element={<BorrowingsDashboardPage />} />
            <Route path="/borrowings/add" element={<BorrowingFormPage />} />
            <Route path="/sales" element={<SalesDashboardPage />} />
            <Route path="/sales/add" element={<SaleFormPage />} />
            <Route path="/sales/edit/:saleId" element={<SaleFormPage />} />
          </Routes>
        </main>
      </div>
     
    </>
  );
}

export default App;
