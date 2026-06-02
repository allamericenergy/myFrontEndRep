import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import Login from './Login.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import AdminDashboard from './AdminDashboard.jsx';
import CompanyList from './components/CompanyList';
import MeterList from './components/meters.jsx';
import MembersList from './components/members.jsx';
import ContractList from './components/contracts.jsx';
import ViewCompany from './components/viewCompany.jsx';
import AddContract from './components/addContract.jsx';
import PdfViewer from './components/PDFViewer.jsx';
import ViewMember from './components/ViewMember.jsx'

function UserDashboard() {
  return <h1>User Dashboard</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user" element={<ProtectedRoute role="user"><UserDashboard /> </ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/meters" element={<MeterList />} />
        <Route path="/members" element={<MembersList/>}/>
        <Route path="/member/:id/show" element={<ViewMember />}/>
        <Route path='/contracts' element={<ContractList/>}/>
        <Route path="/viewCompany/:id" element={<ViewCompany />} />
        <Route path="/addContract/:id" element={<AddContract />} />
        <Route path="/pdf-viewer" element={<PdfViewer/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;