import {Button} from '@/components/ui/button'

interface CreateProfileProps {
  onSubmit: () => void
}

export function CreateProfile({onSubmit}: CreateProfileProps) {
  return (
    <div className="flex flex-col gap-4 items-center">
      <h3 className="font-medium text-base">Create your Profile</h3>
      <p className="text-muted-foreground text-center max-w-xs">
        You are almost done! Please review your information and create your
        profile to get started with Save IA.
      </p>
      <Button type="submit" className="mt-4 w-full max-w-xs" onClick={onSubmit}>
        Create Profile
      </Button>
    </div>
  )
}
