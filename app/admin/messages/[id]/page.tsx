import { notFound } from "next/navigation"
import Link from "next/link"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils/date-formatter"
import { MarkAsRead } from "./mark-as-read"
import { DeleteMessage } from "./delete-message"

export default async function MessagePage({ params }: { params: { id: string } }) {
  const supabase = getSupabaseServerClient()

  const { data: message } = await supabase.from("messages").select("*").eq("id", params.id).single()

  if (!message) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Message</h1>
          <p className="text-muted-foreground">View message details</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/admin/messages">Back to Messages</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Message from {message.name}</CardTitle>
            {message.read ? <Badge variant="outline">Read</Badge> : <Badge>New</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">From</p>
              <p>{message.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p>{message.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p>{formatDate(message.created_at)}</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Message</p>
            <div className="p-4 border rounded-md whitespace-pre-wrap">{message.message}</div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <DeleteMessage id={message.id} />
          {!message.read && <MarkAsRead id={message.id} />}
        </CardFooter>
      </Card>
    </div>
  )
}

