import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useEffect, useState } from "react";

function UserFormDialog({ isOpen, setIsOpen, user, onSave }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [assignedRoles, setAssignedRoles] = useState(new Set());

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setPassword(''); // Don't pre-fill password for security
            setAssignedRoles(new Set(user.roleIds));
        } else {
            // Reset form for new user
            setName('');
            setEmail('');
            setPassword('');
            setAssignedRoles(new Set());
        }
    }, [user, isOpen]); // Rerun effect when user or dialog open state changes

    const handleRoleChange = (roleId) => {
        const newRoles = new Set(assignedRoles);
        if (newRoles.has(roleId)) {
            newRoles.delete(roleId);
        } else {
            newRoles.add(roleId);
        }
        setAssignedRoles(newRoles);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = {
            name,
            email,
            roleIds: Array.from(assignedRoles),
        };
        // Only include password if it's been entered
        if (password) {
            userData.password = password; // In a real app, you'd hash this
        }
        onSave(userData);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[480px]">
                 <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>{user ? 'Edit User' : 'Add New User'}</DialogTitle>
                        <DialogDescription>
                            {user ? 'Update the user details below.' : 'Fill in the details to create a new user.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input id="name" value={name} onChange={e => setName(e.target.value)} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="col-span-3" required />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">Password</Label>
                            <Input id="password" type="password" placeholder={user ? "Leave blank to keep current" : "Required"} className="col-span-3" required={!user} />
                        </div>
                        <div className="grid grid-cols-4 items-start gap-4">
                            <Label className="text-right pt-2">Roles</Label>
                            <div className="col-span-3 grid grid-cols-2 gap-4">
                                {allRoles.map(role => (
                                    <div key={role.id} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`role-${role.id}`} 
                                            checked={assignedRoles.has(role.id)}
                                            onCheckedChange={() => handleRoleChange(role.id)}
                                        />
                                        <label
                                            htmlFor={`role-${role.id}`}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {role.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save Changes</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default UserFormDialog;