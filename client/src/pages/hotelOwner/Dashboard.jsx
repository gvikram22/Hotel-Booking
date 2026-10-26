
import React, { useCallback, useEffect, useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'

const BASE_URL =
  import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

const Dashboard = () => {
  const [rooms, setRooms] = useState([])
  const [bookings, setBookings] = useState([])
  const [totalBookings, setTotalBookings] = useState(0)
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [hotelName, setHotelName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDashboardData = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const token =
        localStorage.getItem('token') ||
        localStorage.getItem('accessToken')

      if (!token) {
        throw new Error('Please log in again to view your dashboard.')
      }

      const headers = {
        Authorization: `Bearer ${token}`
      }

      // Fetch rooms and booking statistics from the backend.
      const [roomsResponse, bookingsResponse] = await Promise.all([
        fetch(`${BASE_URL}/api/rooms/owner`, { headers }),
        fetch(`${BASE_URL}/api/bookings/hotel`, { headers })
      ])

      const [roomsData, bookingsData] = await Promise.all([
        roomsResponse.json(),
        bookingsResponse.json()
      ])

      if (!roomsResponse.ok || !roomsData.success) {
        throw new Error(
          roomsData.message || 'Failed to fetch room data'
        )
      }

      if (!bookingsResponse.ok || !bookingsData.success) {
        throw new Error(
          bookingsData.message || 'Failed to fetch booking data'
        )
      }

      const roomList = roomsData.rooms || []
      const dashboardData = bookingsData.dashboardData || {}

      setRooms(roomList)
      setHotelName(
        roomsData.hotelName || dashboardData.hotelName || ''
      )
      setBookings(dashboardData.bookings || [])
      setTotalBookings(
        Number(dashboardData.totalBookings) || 0
      )
      setTotalRevenue(
        Number(dashboardData.totalRevenue) || 0
      )
    } catch (err) {
      console.error('Dashboard error:', err)
      setError(err.message || 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  const availableRooms = rooms.filter(
    (room) => room.isAvailable
  ).length

  const unavailableRooms = rooms.length - availableRooms

  const stats = [
    {
      title: 'Total Bookings',
      value: totalBookings,
      icon: assets.totalBookingIcon
    },
    {
      title: 'Total Revenue',
      value: `₹${totalRevenue.toLocaleString('en-IN')}`,
      icon: assets.totalRevenueIcon
    },
    {
      title: 'Total Rooms',
      value: rooms.length,
      icon: assets.totalBookingIcon
    },
    {
      title: 'Available Rooms',
      value: availableRooms,
      icon: assets.totalRevenueIcon
    }
  ]

  return (
    <div className="ml-4">
      <Title
        align="left"
        font="outfit"
        title="Dashboard"
        subtitle="Monitor your room listings, track bookings, and review your hotel performance."
      />

      {hotelName && (
        <p className="mt-4 text-gray-600">
          Hotel: <strong>{hotelName}</strong>
        </p>
      )}

      {loading && (
        <p className="my-6 text-gray-500">
          Loading dashboard data...
        </p>
      )}

      {error && (
        <div className="my-6">
          <p className="text-red-600">{error}</p>
          <button
            type="button"
            onClick={fetchDashboardData}
            className="mt-3 rounded border px-4 py-2 hover:bg-gray-50"
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="my-8 flex flex-wrap gap-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className="flex rounded border border-primary/10 bg-primary/3 p-4 pr-8"
              >
                <img
                  src={stat.icon}
                  alt=""
                  className="h-10 max-sm:hidden"
                />

                <div className="flex flex-col font-medium sm:ml-4">
                  <p className="text-lg text-blue-500">
                    {stat.title}
                  </p>
                  <p className="text-base text-neutral-600">
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-medium text-blue-950/70">
              Recent Bookings
            </h2>

            <button
              type="button"
              onClick={fetchDashboardData}
              className="rounded border px-4 py-2 text-sm hover:bg-gray-50"
            >
              Refresh Data
            </button>
          </div>

          <div className="mb-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <p>
              Available rooms: <strong>{availableRooms}</strong>
            </p>
            <p>
              Unavailable rooms: <strong>{unavailableRooms}</strong>
            </p>
          </div>

          <div className="w-full max-w-4xl overflow-x-auto rounded-lg border border-gray-300">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-gray-800">
                    Guest
                  </th>
                  <th className="px-4 py-3 font-medium text-gray-800 max-sm:hidden">
                    Room
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-800">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-gray-800">
                    Payment
                  </th>
                </tr>
              </thead>

              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="border-t px-4 py-8 text-center text-gray-500"
                    >
                      No bookings found yet.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => {
                    const guest =
                      booking.user?.username ||
                      booking.user?.name ||
                      booking.user?.email ||
                      'Guest'

                    const roomName =
                      booking.room?.roomType || 'Room unavailable'

                    const isPaid =
                      booking.isPaid === true ||
                      booking.ispaid === true ||
                      booking.paymentStatus === 'paid'

                    return (
                      <tr key={booking._id}>
                        <td className="border-t px-4 py-3 text-gray-700">
                          {guest}
                        </td>

                        <td className="border-t px-4 py-3 text-gray-700 max-sm:hidden">
                          {roomName}
                        </td>

                        <td className="border-t px-4 py-3 text-center text-gray-700">
                          ₹
                          {Number(booking.totalPrice || 0).toLocaleString(
                            'en-IN'
                          )}
                        </td>

                        <td className="border-t px-4 py-3 text-center">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs ${
                              isPaid
                                ? 'bg-green-100 text-green-700'
                                : 'bg-amber-100 text-amber-700'
                            }`}
                          >
                            {isPaid ? 'Completed' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard