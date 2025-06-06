"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/_components/assistant-ui/thread";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@pkg/ui/components/sidebar";
import { AppSidebar } from "@/_components/app-sidebar";
import { Separator } from "@pkg/ui/components/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@pkg/ui/components/breadcrumb";

/**
 * Assistant组件是应用的主界面，负责管理聊天运行时和布局
 * 
 * @remarks
 * 该组件使用了AssistantRuntimeProvider来管理聊天运行时，
 * 并使用SidebarProvider来管理侧边栏状态。界面包含一个
 * 面包屑导航和一个聊天线程组件。
 * 
 * @example
 * ```tsx
 * <Assistant />
 * ```
 * 
 * @returns 返回包含聊天界面和侧边栏布局的React组件
 */
export const Assistant = () => {
  /**
   * 初始化聊天运行时
   * @remarks
   * 使用useChatRuntime hook创建聊天运行时实例，
   * 配置API端点和初始消息
   */
  const runtime = useChatRuntime({
    api: "/api/chat",
    initialMessages: [
      {
        role: 'user',
        content: 'Hello, how are you?',
      },
      {
        role: 'assistant',
        content: '```mermaid\ngraph TD\n    A[Christmas] -->|Get money| B(Go shopping)\n    B --> C{Let me think}\n    C -->|One| D[Laptop]\n    C -->|Two| E[iPhone]\n    C -->|Three| F[fa:fa-car Car]\n```'
      }
    ],
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Build Your Own ChatGPT UX
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    Starter Template
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <Thread />
        </SidebarInset>
      </SidebarProvider>
    </AssistantRuntimeProvider>
  );
};
