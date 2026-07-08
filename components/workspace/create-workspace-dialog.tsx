"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FiPlus } from "react-icons/fi";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LANGUAGES } from "@/lib/languages";
import {
  createWorkspaceSchema,
  type CreateWorkspaceInput,
} from "@/lib/validations/workspace";
import { useWorkspaceActions } from "@/hooks/use-workspace-actions";

export function CreateWorkspaceDialog() {
  const [open, setOpen] = useState(false);
  const { create, isPending } = useWorkspaceActions();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateWorkspaceInput>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: { language: "javascript" },
  });

  function onSubmit(values: CreateWorkspaceInput) {
    create(values, () => {
      reset();
      setOpen(false);
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <FiPlus size={16} className="mr-1.5" />
          New Workspace
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a workspace</DialogTitle>
          <DialogDescription>
            Give it a name and pick a starting language. You can invite up to 4
            people once it&apos;s created.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FormField
            id="name"
            label="Workspace name"
            placeholder="My awesome project"
            error={errors.name?.message}
            {...register("name")}
          />
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="language">Language</Label>
            <Select id="language" {...register("language")}>
              {LANGUAGES.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" disabled={isPending} className="mt-1 w-full">
            {isPending ? "Creating…" : "Create workspace"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
