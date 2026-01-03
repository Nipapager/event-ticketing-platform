import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import userService from '../api/userService';
import authService from '../api/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setProfile({
        name: data.name || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        address: data.address || '',
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!profile.name.trim()) newErrors.name = 'Name is required';
    if (!profile.email.trim()) newErrors.email = 'Email is required';
    if (profile.email && !/\S+@\S+\.\S+/.test(profile.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setUpdating(true);
    const toastId = toast.loading('Updating profile...');

    try {
      await userService.updateProfile(profile);
      toast.success('Profile updated successfully!', { id: toastId });
      setEditing(false);
      fetchProfile(); // Refresh profile
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile', { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setErrors({});
    fetchProfile(); // Reset to original values
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading profile..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">

          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <span className="text-4xl font-bold text-blue-600">
                  {profile.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-white">
                <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
                <p className="text-blue-100">{profile.email}</p>
                {user?.roles && user.roles.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {user.roles.map(role => (
                      <span
                        key={role}
                        className="px-3 py-1 bg-blue-500 bg-opacity-50 rounded-full text-sm font-medium"
                      >
                        {role.replace('ROLE_', '')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  {editing ? (
                    <>
                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter your full name"
                      />
                      {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                    </>
                  ) : (
                    <p className="text-gray-800 text-lg">{profile.name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <p className="text-gray-800 text-lg">{profile.email}</p>
                  <p className="text-sm text-gray-500 mt-1">Email cannot be changed</p>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    <p className="text-gray-800 text-lg">
                      {profile.phoneNumber || <span className="text-gray-400">Not provided</span>}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address
                  </label>
                  {editing ? (
                    <textarea
                      name="address"
                      value={profile.address}
                      onChange={handleInputChange}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your address"
                    />
                  ) : (
                    <p className="text-gray-800 text-lg">
                      {profile.address || <span className="text-gray-400">Not provided</span>}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 border-t">
                  {editing ? (
                    <>
                      <button
                        type="button"
                        onClick={handleCancel}
                        className="flex-1 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                        disabled={updating}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={updating}
                        className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {updating ? 'Saving...' : 'Save Changes'}
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setEditing(true)}
                      className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                    >
                      Edit Profile
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Danger Zone */}
          <div className="px-8 py-6 bg-gray-50 border-t">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Account Actions</h3>
            <div className="flex gap-4">
              <button
                onClick={handleLogout}
                className="border border-red-300 text-red-600 px-6 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;