
import React, { useCallback, useEffect, useState } from 'react'
import Title from '../../components/Title'

const BASE_URL =
  import.meta.env.VITE_BASE_URL || 'http://localhost:3000'

const ListRoom = () => {
  const [rooms, setRooms] = useState([])
  const [hotelName, setHotelName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState('')
  const [updatingId, setUpdatingId] = useState('')

  const getToken = () =>
    localStorage.getItem('token') ||
    localStorage.getItem('accessToken')

  const fetchRooms = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const token = getToken()

      if (!token) {
        throw new Error('Please log in again to view your rooms.')
      }

      const response = await fetch(`${BASE_URL}/api/rooms/owner`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to fetch rooms')
      }

      setRooms(data.rooms || [])
      setHotelName(data.hotelName || '')
    } catch (err) {
      setError(err.message || 'Failed to load rooms')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRooms()
  }, [fetchRooms])

  const toggleAvailability = async (roomId) => {
    try {
      setUpdatingId(roomId)

      const token = getToken()

      const response = await fetch(
        `${BASE_URL}/api/rooms/toggle-availability`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ roomId })
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to update availability')
      }

      setRooms((previous) =>
        previous.map((room) =>
          room._id === roomId
            ? { ...room, isAvailable: data.isAvailable }
            : room
        )
      )
    } catch (err) {
      alert(err.message)
    } finally {
      setUpdatingId('')
    }
  }

  const deleteRoom = async (room) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${room.roomType}"? This action cannot be undone.`
    )

    if (!confirmed) return

    try {
      setDeletingId(room._id)

      const token = getToken()

      const response = await fetch(
        `${BASE_URL}/api/rooms/${room._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete room')
      }

      setRooms((previous) =>
        previous.filter((item) => item._id !== room._id)
      )
    } catch (err) {
      alert(err.message)
    } finally {
      setDeletingId('')
    }
  }

  return (
    <div>
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View and manage the rooms saved in your database."
      />

      {hotelName && (
        <p className="mt-5 text-gray-600">
          Hotel: <strong>{hotelName}</strong>
        </p>
      )}

      <p className="mt-8 text-gray-500">
        Total rooms: {rooms.length}
      </p>

      {loading && <p className="mt-4">Loading rooms...</p>}

      {error && (
        <div className="mt-4">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchRooms}
            className="mt-2 rounded border px-4 py-2"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && rooms.length === 0 && (
        <p className="mt-4">
          No rooms found. Add your first room.
        </p>
      )}

      {!loading && !error && rooms.length > 0 && (
        <div className="mt-4 w-full overflow-x-auto rounded-lg border border-gray-300">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3 max-sm:hidden">Amenities</th>
                <th className="px-4 py-3 text-center">Price/Night</th>
                <th className="px-4 py-3 text-center">Available</th>
                <th className="px-4 py-3 text-center">Action</th>
              </tr>
            </thead>

            <tbody className="text-sm">
              {rooms.map((room) => (
                <tr key={room._id}>
                  <td className="border-t px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={room.images?.[0] || '/default-room.jpg'}
                        alt={room.roomType}
                        className="h-12 w-16 rounded object-cover"
                      />
                      <span>{room.roomType}</span>
                    </div>
                  </td>

                  <td className="border-t px-4 py-3 max-sm:hidden">
                    {room.amenities?.length
                      ? room.amenities.join(', ')
                      : 'None'}
                  </td>

                  <td className="border-t px-4 py-3 text-center">
                    ₹{room.pricePerNight}
                  </td>

                  <td className="border-t px-4 py-3 text-center">
                    <input
                      type="checkbox"
                      checked={Boolean(room.isAvailable)}
                      disabled={updatingId === room._id}
                      onChange={() => toggleAvailability(room._id)}
                      className="h-4 w-4 cursor-pointer"
                      aria-label={`Toggle availability for ${room.roomType}`}
                    />
                  </td>

                  <td className="border-t px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={() => deleteRoom(room)}
                      disabled={deletingId === room._id}
                      className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      {deletingId === room._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ListRoom
