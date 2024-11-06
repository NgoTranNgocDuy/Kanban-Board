import { memo, useMemo } from "react";
import { theme } from "antd";
import { useDelete, useNavigation } from "@refinedev/core";
import { ClockCircleOutlined, DeleteOutlined, EyeOutlined, MoreOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Button, Card, ConfigProvider, Dropdown, Skeleton, Space, Tag, Tooltip } from "antd";
import dayjs from "dayjs";
import { CustomAvatar, Text, TextIcon } from "@/components";
import type { User } from "@/graphql/schema.types";
import { getDateColor } from "@/utilities";

type ProjectCardProps = {
    id: string;
    title: string;
    updatedAt: string;
    dueDate?: string;
    users?: { id: string; name: string; avatarUrl?: User["avatarUrl"]; }[];
};

export const ProjectCard = ({ id, title, dueDate = "", users = [] }: ProjectCardProps) => {
    const { token } = theme.useToken();
    const { edit } = useNavigation();
    const { mutate } = useDelete();

    const dropdownItems = useMemo<MenuProps["items"]>(() => [
        {
            label: "View card",
            key: "1",
            icon: <EyeOutlined style={{ color: "#40a9ff" }} />,
            onClick: () => edit("tasks", id, "replace"),
        },
        {
            danger: true,
            label: "Delete card",
            key: "2",
            icon: <DeleteOutlined style={{ color: "#ff4d4f" }} />,
            onClick: () => mutate({ resource: "tasks", id, meta: { operation: "task" } }),
        },
    ], [edit, id, mutate]);

    const dueDateOptions = useMemo(() => {
        if (!dueDate) return null;
        const date = dayjs(dueDate);
        return {
            color: getDateColor({ date: dueDate }) as string,
            text: date.format("MMM D"),
        };
    }, [dueDate]);

    return (
        <ConfigProvider
            theme={{
                components: {
                    Card: {
                        colorBgContainer: "#2a2f36",
                        colorText: "#e0e0e0",
                        borderRadius: 10,
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.6)",
                    },
                    Tag: {
                        colorText: "#ffffff",
                        colorBgContainer: "rgba(138, 154, 169, 0.25)",
                    },
                },
            }}
        >
            <Card
                size="small"
                title={<Text ellipsis={{ tooltip: title }}>{title}</Text>}
                onClick={() => edit("tasks", id, "replace")}
                extra={
                    <Dropdown
                        trigger={["click"]}
                        menu={{ items: dropdownItems }}
                        placement="bottom"
                        arrow={{ pointAtCenter: true }}
                    >
                        <Button
                            type="text"
                            shape="circle"
                            icon={<MoreOutlined style={{ transform: "rotate(90deg)" }} />}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </Dropdown>
                }
                style={{
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                className="project-card"
                hoverable
            >
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px" }}>
                    <TextIcon style={{ marginRight: "4px" }} />
                    {dueDateOptions && (
                        <Tag
                            icon={<ClockCircleOutlined style={{ fontSize: "12px" }} />}
                            color={dueDateOptions.color}
                            style={{
                                padding: "0 4px",
                                backgroundColor: dueDateOptions.color === "default" ? "transparent" : "unset",
                            }}
                            bordered={dueDateOptions.color !== "default"}
                        >
                            {dueDateOptions.text}
                        </Tag>
                    )}
                    {!!users.length && (
                        <Space size={4} wrap direction="horizontal" align="center" style={{ marginLeft: "auto" }}>
                            {users.map((user) => (
                                <Tooltip key={user.id} title={user.name}>
                                    <CustomAvatar name={user.name} src={user.avatarUrl} />
                                </Tooltip>
                            ))}
                        </Space>
                    )}
                </div>
            </Card>
        </ConfigProvider>
    );
};

// Skeleton component for loading state
export const ProjectCardSkeleton = () => (
    <Card
        size="small"
        bodyStyle={{ display: "flex", justifyContent: "center", gap: "8px" }}
        title={<Skeleton.Button active size="small" style={{ width: "200px", height: "22px" }} />}
    >
        <Skeleton.Button active size="small" style={{ width: "200px" }} />
        <Skeleton.Avatar active size="small" />
    </Card>
);

// Enhanced memoization to compare `users` array more accurately
export const ProjectCardMemo = memo(ProjectCard, (prev, next) => (
  prev.id === next.id &&
  prev.title === next.title &&
  prev.dueDate === next.dueDate &&
  prev.users?.length === next.users?.length &&
  prev.updatedAt === next.updatedAt
));
