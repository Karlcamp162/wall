"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getSupabaseClient } from "@/lib/supabaseClient";

const SidebarLink = ({ children }) => (
  <a className="text-sm text-blue-700 hover:underline" href="#">{children}</a>
);

export default function Home() {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load from Supabase and subscribe to realtime
  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const load = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("messages")
        .select("id, name, text, created_at")
        .order("created_at", { ascending: false })
        .limit(100);
      if (!error && Array.isArray(data)) {
        // Normalize to createdAt for UI
        setMessages(data.map((d) => ({ id: d.id, name: d.name, text: d.text, createdAt: d.created_at })));
      }
      setLoading(false);
    };

    load();

    const channel = supabase
      .channel("messages-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const m = payload.new;
          setMessages((prev) => [
            { id: m.id, name: m.name, text: m.text, createdAt: m.created_at },
            ...prev,
          ]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const remaining = useMemo(() => 280 - text.length, [text]);

  const handleShare = async () => {
    if (!name.trim() || !text.trim() || text.length > 280) return;
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.from("messages").insert({ name: name.trim(), text: text.trim() });
    setText("");
  };

  const initials = (fullName) => {
    const parts = fullName.split(/\s+/).filter(Boolean);
    return (parts[0]?.[0] || "?") + (parts[1]?.[0] || "");
  };

  return (
    <div className="min-h-screen bg-[#e6edf5]">
      {/* Top blue bar */}
      <div className="w-full bg-[#3b5998] text-white">
        <div className="mx-auto max-w-6xl px-4 h-10 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-bold text-lg">facebook</span>
            <div className="hidden md:flex items-center gap-2">
              <Input className="h-7 w-64 bg-white text-black placeholder:text-gray-500" placeholder="Search" />
              <Button size="sm" className="h-7 px-3">Search</Button>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <a href="#" className="hover:underline">Home</a>
            <a href="#" className="hover:underline">Profile</a>
            <a href="#" className="hover:underline">Friends</a>
            <a href="#" className="hover:underline">Inbox</a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-12 gap-6">
        {/* Left column */}
        <div className="col-span-3 space-y-4">
          <Card>
            <CardContent className="p-3">
              <div className="w-full bg-gray-200 flex items-center justify-center overflow-hidden" style={{aspectRatio: "3/4"}}>
                <Image src="/colored.jpg" width={400} height={520} alt="Profile photo" className="w-full h-full object-cover" />
              </div>
              <div className="mt-3 space-y-1">
                <SidebarLink>View Photos of Karl (541)</SidebarLink>
                <SidebarLink>View Videos of Karl (14)</SidebarLink>
                <SidebarLink>Send Karl a Message</SidebarLink>
                <SidebarLink>Poke Karl</SidebarLink>
                <SidebarLink>Subscribe via SMS</SidebarLink>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 text-sm space-y-2">
              <div className="font-semibold">Information</div>
              <div>
                <div className="text-gray-500">Networks:</div>
                <div>Facebook, Harvard Alum</div>
              </div>
              <div>
                <div className="text-gray-500">Birthday:</div>
                <div>May 14, 1984</div>
              </div>
              <div>
                <div className="text-gray-500">Current City:</div>
                <div>Palo Alto, CA</div>
              </div>
              <div className="pt-2 text-gray-500">Mutual friends</div>
              <div>287 friends in common</div>
            </CardContent>
          </Card>
        </div>

        {/* Middle column */}
        <div className="col-span-6 space-y-4">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">Karl Louise Campos</h1>
            <Badge variant="secondary" className="uppercase">Wall</Badge>
            <Badge variant="secondary">Info</Badge>
            <Badge variant="secondary">Photos</Badge>
            <Badge variant="secondary">Notes</Badge>
            <Badge variant="secondary">Boxes</Badge>
          </div>
          <Card>
            <CardContent className="p-3 space-y-3">
              <div className="flex items-start gap-2">
                <div className="flex flex-col gap-2 w-full">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                  <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value.slice(0, 280))}
                    maxLength={280}
                    placeholder="Write something... (max 280 characters)"
                    className="min-h-20"
                  />
                  <div className="flex items-center justify-between">
                    <div className={`text-xs ${remaining < 0 ? "text-red-600" : "text-gray-600"}`}>
                      {remaining} characters left
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleShare} disabled={!name.trim() || !text.trim() || remaining < 0}>Share</Button>
                      <Button variant="outline" onClick={() => setText("")}>Clear</Button>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="text-sm text-gray-600">Recent Activity</div>
              <div className="text-sm">
                Mark likes Nick Schrock&apos;s photo. Mark likes Bubba Murarka&apos;s album Wall Photos.
              </div>
            </CardContent>
          </Card>

          {/* Posts feed (newest first) */}
          <Card>
            <CardContent className="p-4 space-y-5">
              {loading ? (
                <div className="text-sm text-gray-600">Loading messages…</div>
              ) : messages.length === 0 ? (
                <div className="text-sm text-gray-600">No messages yet. Be the first to post.</div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="flex gap-3">
                    <Avatar>
                      <AvatarImage src="" />
                      <AvatarFallback>{initials(m.name)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold">{m.name}</span>
                        <span className="text-gray-500">{new Date(m.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="text-sm text-gray-800 break-words whitespace-pre-wrap">
                        {m.text}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column (ads) */}
        <div className="col-span-3 space-y-4">
          <Card>
            <CardContent className="p-3">
              <div className="text-sm font-semibold">Advertise</div>
              <ScrollArea className="h-[520px] mt-2">
                {["Scuba Diving Vacations","Hard Drive Imaging?","Wedding Card Box"].map((ad) => (
                  <div key={ad} className="mb-4">
                    <div className="bg-white rounded border p-2">
                      <div className="bg-gray-200 h-28" />
                      <div className="mt-2 text-sm font-medium">{ad}</div>
                      <div className="text-xs text-gray-600">Sample ad copy to mirror the mock.</div>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
