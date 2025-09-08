"use client";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

const SidebarLink = ({ children }) => (
  <a className="text-sm text-blue-700 hover:underline" href="#">{children}</a>
);

export default function Home() {
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
              <div className="aspect-square w-full bg-gray-200 flex items-center justify-center">
                <Image src="/next.svg" width={120} height={120} alt="profile" className="opacity-30" />
              </div>
              <div className="mt-3 space-y-1">
                <SidebarLink>View Photos of Mark (541)</SidebarLink>
                <SidebarLink>View Videos of Mark (14)</SidebarLink>
                <SidebarLink>Send Mark a Message</SidebarLink>
                <SidebarLink>Poke Mark</SidebarLink>
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
            <h1 className="text-2xl font-semibold">Mark Zuckerberg</h1>
            <Badge variant="secondary" className="uppercase">Wall</Badge>
            <Badge variant="secondary">Info</Badge>
            <Badge variant="secondary">Photos</Badge>
            <Badge variant="secondary">Notes</Badge>
            <Badge variant="secondary">Boxes</Badge>
          </div>
          <Card>
            <CardContent className="p-3 space-y-3">
              <div className="flex items-center gap-2">
                <Textarea placeholder="Write something..." className="min-h-20" />
                <div className="flex flex-col gap-2">
                  <Button>Share</Button>
                  <Button variant="outline">Attach</Button>
                </div>
              </div>
              <Separator />
              <div className="text-sm text-gray-600">Recent Activity</div>
              <div className="text-sm">
                Mark likes Nick Schrock&apos;s photo. Mark likes Bubba Murarka&apos;s album Wall Photos.
              </div>
            </CardContent>
          </Card>

          {/* Posts */}
          <Card>
            <CardContent className="p-4 space-y-5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>MZ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold">Mark Zuckerberg</span>
                      <span className="text-gray-500">June {i} at 12:02am</span>
                    </div>
                    <div className="text-sm text-gray-800">
                      Photowalk around Facebook&apos;s new headquarters
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      <div className="bg-gray-200 aspect-video" />
                      <div className="bg-gray-200 aspect-video" />
                      <div className="bg-gray-200 aspect-video" />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">View album</div>
                  </div>
                </div>
              ))}
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
