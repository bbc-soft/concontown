'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MoreVertical } from 'lucide-react';
import { useAuthStore } from '../../stores/useAuthStore';

interface Friend {
  idx: number;
  name: string;
  email: string;
}

export default function TourFriendListPage() {
  const router = useRouter();
  const { member } = useAuthStore();
  const [friends, setFriends] = useState<Friend[]>([]);
//   const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null);
  const [showOptions, setShowOptions] = useState<number | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Friend | null>(null);

  useEffect(() => {
    if (member?.idx) fetchFriends();
  }, [member]);

  const fetchFriends = async () => {
    const res = await fetch(`/api/tourfriends?member_idx=${member?.idx}`);
    const data = await res.json();
    setFriends(data);
  };

  const handleEdit = (friend: Friend) => {
    router.push(`/tourfriends/edit/${friend.idx}`);
  };

  const handleDelete = async (friend: Friend) => {
    await fetch(`/api/tourfriends/${friend.idx}?member_idx=${member?.idx}`, {
      method: 'DELETE'
    });
    setConfirmDelete(null);
    fetchFriends();
  };

  return (
    <div className="min-h-screen bg-white text-black px-5 pt-12 pb-20">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => router.back()}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-bold">My Tour Friends</h1>
      </div>

      {friends.length === 0 ? (
        <div className="text-center text-[16px] text-gray-500 mt-20">
          <p>You haven’t added any friends yet.</p>
          <button
            onClick={() => router.push('/tourfriends/add')}
            className="mt-6 bg-[#FF8FA9] text-white font-semibold py-3 px-6 rounded-xl"
          >
            Add Friend
          </button>
        </div>
      ) : (
        <>
          <ul className="space-y-4">
            {friends.map((friend) => (
              <li
                key={friend.idx}
                className="flex justify-between items-center p-4 border rounded-xl relative"
              >
                <div>
                  <p className="font-semibold text-[16px]">{friend.name}</p>
                  <p className="text-xs text-gray-500">{friend.email}</p>
                </div>
                <button onClick={() => setShowOptions(friend.idx)}>
                  <MoreVertical size={18} />
                </button>

                {showOptions === friend.idx && (
                  <div className="absolute right-4 top-12 z-10 bg-white border rounded-md shadow-md w-28 text-[16px]">
                    <button
                      className="w-full px-4 py-2 hover:bg-gray-100 text-left"
                      onClick={() => handleEdit(friend)}
                    >
                      Edit
                    </button>
                    <button
                      className="w-full px-4 py-2 text-red-500 hover:bg-gray-100 text-left"
                      onClick={() => setConfirmDelete(friend)}
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>

          <button
            onClick={() => router.push('/tourfriends/add')}
            className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-[#FF8FA9] text-white font-semibold py-3 px-6 rounded-xl"
          >
            Add Tour Friend
          </button>
        </>
      )}

      {/* 삭제 확인 모달 */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 text-center">
            <p className="text-[16px] text-gray-700 mb-4">
              Are you sure you want to delete your post? Once deleted, it cannot be restored.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-200 rounded-md text-[16px]"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete)}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-[16px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
