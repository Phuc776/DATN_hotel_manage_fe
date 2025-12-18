import { Routes, Route } from "react-router-dom"
import PrivateRoute from "../auth/PrivateRoute"
import NotFound from "../pages/NotFound"

// layouts
import AdminLayout from "../layouts/AdminLayout"
import GuestLayout from "../layouts/GuestLayout"
import OwnerLayout from "../layouts/OwnerLayout"
import StaffLayout from "../layouts/StaffLayout"
import UserLayout from "../layouts/UserLayout"

// pages
import GuestHotelDetail from "../pages/guest/HotelDetail"
import GuestRoomPostDetail from "../pages/guest/RoomPostDetail"
import SearchAvailable from "../pages/user/SearchAvailable"
import CustomerBookingForm from "../pages/user/CustomerBookingForm"

import Login from "../pages/auth/Login"
import Register from "../pages/auth/Register"

// Admin pages
import AdminDashboard from "../pages/admin/Dashboard"
import AdminUsers from "../pages/admin/Users"
import AdminUserDetail from "../pages/admin/UserDetail"
import AdminHotels from "../pages/admin/Hotels"
import AdminPendingHotels from "../pages/admin/PendingHotels"
import AdminHotelDetail from "../pages/admin/HotelDetail"
import AdminRoomPosts from "../pages/admin/RoomPosts"
import AdminRoomPostDetail from "../pages/admin/RoomPostDetail"
import AdminNotification from "../pages/admin/Notification"

import Home from "../pages/guest/Home"

// Owner pages
import OwnerDashboard from "../pages/hotel_owner/Dashboard"
import OwnerStaff from "../pages/hotel_owner/Staff"
import StaffDetail from "../pages/hotel_owner/StaffDetail"
import OwnerHotels from "../pages/hotel_owner/Hotels";
import HotelDetail from "../pages/hotel_owner/HotelDetail"
import RoomPosts from "../pages/hotel_owner/RoomPosts"
import RoomPostDetail from "../pages/hotel_owner/RoomPostDetail"
import OwnerRooms from "../pages/hotel_owner/Rooms"
import OwnerRoomDetail from "../pages/hotel_owner/RoomDetail"
import OwnerNotification from "../pages/hotel_owner/Notification"
import Roomtypes from "../pages/hotel_owner/Roomtypes"
import RoomtypeDetail from "../pages/hotel_owner/RoomtypeDetail"
import Services from "../pages/hotel_owner/Services"
import ServiceDetail from "../pages/hotel_owner/ServiceDetail"

// Staff pages
import StaffDashboard from "../pages/staff/Dashboard"
import StaffBookings from "../pages/staff/Bookings"
import StaffRooms from "../pages/staff/Rooms"
import StaffRoomDetail from "../pages/staff/RoomDetail"
import StaffServices from "../pages/staff/Services"

// User pages
import UserDashboard from "../pages/user/Dashboard"
import MyBookings from "../pages/user/MyBookings"
import BookingDetail from "../pages/user/BookingDetail"
import CustomerProfile from "../pages/user/CustomerProfile"

function Unauthorized() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">403</h1>
        <p className="text-xl text-gray-800 mb-6">Truy cập bị từ chối</p>
        <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Quay lại Đăng Nhập
        </a>
      </div>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Guest pages */}
      <Route element={<GuestLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/hotels/:id" element={<GuestHotelDetail />} />
        <Route path="/room-posts/:id" element={<GuestRoomPostDetail />} />
        <Route path="/search" element={<SearchAvailable />} />
        <Route path="/search/:baiDangPhongId" element={<CustomerBookingForm />} />

      </Route>

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <PrivateRoute roles={["ADMIN"]}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="users/:id" element={<AdminUserDetail />} />
        <Route path="hotels" element={<AdminHotels />} />
        <Route path="pending-hotels" element={<AdminPendingHotels />} />
        <Route path="hotels/:id" element={<AdminHotelDetail />} />
        <Route path="room-posts" element={<AdminRoomPosts />} />
        <Route path="room-posts/:id" element={<AdminRoomPostDetail />} />
        <Route path="notif" element={<AdminNotification />} />

      </Route>

      {/* OWNER - CHU_KHACH_SAN */}
      <Route
        path="/owner"
        element={
          <PrivateRoute roles={["CHU_KHACH_SAN"]}>
            <OwnerLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<OwnerDashboard />} />
        <Route path="staff" element={<OwnerStaff />} />
        <Route path="staff/:id" element={<StaffDetail />} />
        <Route path="hotels" element={<OwnerHotels />} />
        <Route path="hotels/:id" element={<HotelDetail />} />
        <Route path="room-posts" element={<RoomPosts />} />
        <Route path="room-posts/:id" element={<RoomPostDetail />} />
        <Route path="rooms" element={<OwnerRooms />} />
        <Route path="rooms/:id" element={<OwnerRoomDetail />} />
        <Route path="notif" element={<OwnerNotification />} />
        <Route path="roomtypes" element={<Roomtypes />} />
        <Route path="roomtypes/:id" element={<RoomtypeDetail />} />
        <Route path="services" element={<Services />} />
        <Route path="services/:id" element={<ServiceDetail />} />
        <Route
          path="bookings"
          element={
            <div className="p-6">
              <h1>Quản lý Đặt Phòng</h1>
            </div>
          }
        />
        
        
      </Route>

      {/* STAFF - NHAN_VIEN */}
      <Route
        path="/staff"
        element={
          <PrivateRoute roles={["NHAN_VIEN", "CHU_KHACH_SAN"]}>
            <StaffLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<StaffDashboard />} />
        <Route path="bookings" element={<StaffBookings />} />
        <Route path="rooms" element={<StaffRooms />} />
        <Route path="rooms/:id" element={<StaffRoomDetail />} />
        <Route path="services" element={<StaffServices />} />

      </Route>

      {/* USER - KHACH_HANG */}
      <Route
        path="/user"
        element={
          <PrivateRoute roles={["KHACH_HANG"]}>
            <UserLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<UserDashboard />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="bookings/:id" element={<BookingDetail />} />
        <Route
          path="favorites"
          element={
            <div className="p-6">
              <h1>Khách sạn Yêu Thích</h1>
            </div>
          }
        />
        <Route
          path="profile"
          element={<CustomerProfile />}
        />
        <Route
          path="reviews"
          element={
            <div className="p-6">
              <h1>Đánh Giá Của Tôi</h1>
            </div>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
