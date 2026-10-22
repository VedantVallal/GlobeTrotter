'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  ShieldCheck,
  Eye,
  Trash2,
  CheckCircle,
  Ban,
  UserPlus,
  Compass,
  Calendar,
} from 'lucide-react';
import DataTable from '@/components/admin/DataTable';
import DetailDrawer from '@/components/admin/DetailDrawer';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { useAdmin } from '@/components/admin/AdminLayout';
import { adminService } from '@/lib/services';
import styles from '@/components/admin/admin.module.css';

export default function AdminUsersPage() {
  const { showToast } = useAdmin();
  const [users, setUsers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  // Modals & Drawer State
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminService.getUsers({
        search,
        status: statusFilter,
        page,
        limit: 10,
      });
      setUsers(res.users);
      setTotalCount(res.total);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to load users', err);
      showToast('Error loading users list', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, page, showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle status toggle
  const handleToggleStatus = async (user, newStatus) => {
    try {
      await adminService.updateUserStatus(user.id, newStatus);
      showToast(`User ${user.name} marked as ${newStatus}`);
      fetchUsers();
      if (selectedUser?.id === user.id) {
        setSelectedUser({ ...selectedUser, status: newStatus });
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  // Handle user delete confirmation
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    try {
      await adminService.deleteUser(userToDelete.id);
      showToast(`User ${userToDelete.name} has been deleted (Demo)`, 'info');
      setUserToDelete(null);
      if (selectedUser?.id === userToDelete.id) {
        setSelectedUser(null);
      }
      fetchUsers();
    } catch (err) {
      showToast('Failed to delete user', 'error');
    }
  };

  const columns = [
    {
      key: 'name',
      label: 'User',
      render: (u) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src={u.avatar}
            alt={u.name}
            style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--gt-text-primary, #182331)' }}>{u.name}</div>
            <div style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)' }}>{u.country}</div>
          </div>
        </div>
      ),
    },
    {
      key: 'email',
      label: 'Email',
      render: (u) => (
        <span style={{ color: 'var(--gt-text-secondary, #647184)' }}>{u.email}</span>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (u) => (
        <span
          className={`${styles.badge} ${u.role.includes('Admin') ? styles.badgeSuperAdmin : styles.badgeInactive}`}
        >
          {u.role.includes('Admin') && <ShieldCheck size={11} />}
          {u.role}
        </span>
      ),
    },
    {
      key: 'tripsCount',
      label: 'Trips',
      align: 'center',
      render: (u) => (
        <span style={{ fontWeight: 600, color: 'var(--gt-text-primary, #182331)' }}>
          {u.tripsCount}
        </span>
      ),
    },
    {
      key: 'joinedAt',
      label: 'Registered',
      render: (u) => (
        <span style={{ color: 'var(--gt-text-muted, #8a96a6)', fontSize: 12 }}>
          {u.joinedAt}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (u) => {
        let badgeClass = styles.badgeActive;
        if (u.status === 'Inactive') badgeClass = styles.badgeInactive;
        if (u.status === 'Suspended') badgeClass = styles.badgeSuspended;
        return <span className={`${styles.badge} ${badgeClass}`}>{u.status}</span>;
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'right',
      render: (u) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary} ${styles.btnSm}`}
            onClick={() => setSelectedUser(u)}
            title="View Details"
          >
            <Eye size={12} />
            <span>View</span>
          </button>

          {u.role !== 'Super Admin' && (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm} ${styles.btnIcon}`}
              onClick={() => setUserToDelete(u)}
              title="Delete User"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Page Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: 'var(--gt-text-primary, #182331)' }}>
            User Management
          </h1>
          <p style={{ margin: '3px 0 0 0', fontSize: 13, color: 'var(--gt-text-secondary, #647184)' }}>
            View and administer all registered travel planners, role privileges, and account states.
          </p>
        </div>

        <button
          type="button"
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => showToast('User invite link copied to clipboard')}
        >
          <UserPlus size={14} />
          <span>Invite Administrator</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox} style={{ display: 'block', width: 280 }}>
          <Search size={14} className={styles.searchIcon} />
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name, email, or country..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className={styles.filterGroup}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Filter size={13} color="var(--gt-text-muted, #8a96a6)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gt-text-secondary, #647184)' }}>Status:</span>
          </div>
          <select
            className={styles.filterSelect}
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Users Data Table */}
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyTitle="No users found"
        emptyMessage="No user profiles matched your current search criteria."
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={(p) => setPage(p)}
        onRowClick={(u) => setSelectedUser(u)}
      />

      {/* User Detail Slide-over Drawer */}
      <DetailDrawer
        isOpen={Boolean(selectedUser)}
        title={selectedUser ? `${selectedUser.name} — Profile` : 'User Details'}
        onClose={() => setSelectedUser(null)}
        footer={
          selectedUser && (
            <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between' }}>
              {selectedUser.status === 'Active' ? (
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnDanger}`}
                  onClick={() => handleToggleStatus(selectedUser, 'Suspended')}
                >
                  <Ban size={13} />
                  <span>Suspend Account</span>
                </button>
              ) : (
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnPrimary}`}
                  onClick={() => handleToggleStatus(selectedUser, 'Active')}
                >
                  <CheckCircle size={13} />
                  <span>Reactivate Account</span>
                </button>
              )}

              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setSelectedUser(null)}
              >
                Close
              </button>
            </div>
          )
        }
      >
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {/* Header Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: 16,
                background: '#f8fafc',
                borderRadius: 10,
                border: '1px solid var(--gt-border, #e1e7ee)',
              }}
            >
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gt-text-primary, #182331)' }}>
                  {selectedUser.name}
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--gt-text-secondary, #647184)' }}>
                  {selectedUser.email}
                </div>
                <div style={{ marginTop: 6, display: 'flex', gap: 6 }}>
                  <span className={`${styles.badge} ${selectedUser.status === 'Active' ? styles.badgeActive : styles.badgeSuspended}`}>
                    {selectedUser.status}
                  </span>
                  <span className={`${styles.badge} ${selectedUser.role.includes('Admin') ? styles.badgeSuperAdmin : styles.badgeInactive}`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ padding: 12, background: '#ffffff', border: '1px solid var(--gt-border, #e1e7ee)', borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)', textTransform: 'uppercase' }}>Trips Planned</span>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--gt-blue, #4169d8)', marginTop: 2 }}>
                  {selectedUser.tripsCount} Trips
                </div>
              </div>
              <div style={{ padding: 12, background: '#ffffff', border: '1px solid var(--gt-border, #e1e7ee)', borderRadius: 8 }}>
                <span style={{ fontSize: 11, color: 'var(--gt-text-muted, #8a96a6)', textTransform: 'uppercase' }}>Last Activity</span>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gt-text-primary, #182331)', marginTop: 4 }}>
                  {selectedUser.lastActive}
                </div>
              </div>
            </div>

            {/* Metadata Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--gt-text-secondary, #647184)' }}>User Identifier:</span>
                <code style={{ fontSize: 11, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{selectedUser.id}</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--gt-text-secondary, #647184)' }}>Registration Date:</span>
                <strong style={{ color: 'var(--gt-text-primary, #182331)' }}>{selectedUser.joinedAt}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 8, borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: 'var(--gt-text-secondary, #647184)' }}>Home Country:</span>
                <strong style={{ color: 'var(--gt-text-primary, #182331)' }}>{selectedUser.country}</strong>
              </div>
            </div>
          </div>
        )}
      </DetailDrawer>

      {/* Delete User Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(userToDelete)}
        title="Delete User Account"
        message={`Are you sure you want to permanently remove ${userToDelete?.name} (${userToDelete?.email})? All associated mock trips will be archived.`}
        confirmText="Delete User"
        onConfirm={handleConfirmDelete}
        onCancel={() => setUserToDelete(null)}
      />
    </div>
  );
}
