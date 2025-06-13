'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ProfileSwitcherProps {
  currentView?: string;
}

const ProfileSwitcher: React.FC<ProfileSwitcherProps> = ({ currentView = 'manager' }) => {
  const router = useRouter();
  const [view, setView] = useState(currentView);

  const handleViewChange = (newView: string) => {
    setView(newView);
    
    // In a real implementation, this would update the user's session
    // For now, we'll just navigate to the appropriate page
    if (newView === 'learner') {
      router.push('/platform/learner-profile');
    } else {
      router.push('/platform/dashboard');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Avatar className="h-6 w-6">
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <span>{view === 'learner' ? 'Learner View' : 'Manager View'}</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Switch View</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          className={view === 'manager' ? 'bg-blue-50 text-blue-700' : ''}
          onClick={() => handleViewChange('manager')}
        >
          Manager View
        </DropdownMenuItem>
        <DropdownMenuItem 
          className={view === 'learner' ? 'bg-blue-50 text-blue-700' : ''}
          onClick={() => handleViewChange('learner')}
        >
          Learner View
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileSwitcher;
