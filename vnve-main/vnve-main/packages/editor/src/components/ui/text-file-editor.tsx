"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileSelector } from "./file-selector";
import { Loader2, Plus, Split, FileText, Minus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTemplates } from "@/components/hooks/useTemplates";
import { Label } from "./label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface TextFileEditorProps {
  children?: React.ReactNode;
  value: string;
  placeholder?: string;
  completeButtonLabel?: string;
  loading?: boolean | string;
  onChange: (value: string) => void;
  onComplete: (content: string) => void;
  onChangeTemplate?: (template: string) => void;
}

function SceneSplitter({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const lines = value.split('\n');

  const handleInsertBreak = (index: number) => {
    const newLines = [...lines];
    // Insert empty line, Title, Name, Empty line
    newLines.splice(index, 0, "", "标题", `场景 ${index + 1}`, "");
    onChange(newLines.join('\n'));
  };

  const handleRemoveBreak = (index: number) => {
    const newLines = [...lines];
    // Remove Title, Name, Empty line (up to 3 lines)
    // We need to be careful to remove the correct lines related to the split
    // The structure is: [Empty], "标题", "场景 X", [Empty]
    // But since users might edit, we just remove the current line if it is a header
    // and potentially surrounding lines if they match the pattern
    
    // Simple removal: Remove the current "标题" line and the next line if it is a scene name
    if (newLines[index].trim() === '标题') {
        let removeCount = 1;
        if (index + 1 < newLines.length && newLines[index+1].trim().startsWith('场景')) {
            removeCount++;
        }
        // Also remove previous empty line if it exists
        if (index > 0 && newLines[index-1].trim() === '') {
            newLines.splice(index-1, 1);
            index--; 
        }
        newLines.splice(index, removeCount);
        onChange(newLines.join('\n'));
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
        提示：点击行号旁的 <Plus className="inline w-3 h-3" /> 按钮可以在该行前插入新的场景分割点。点击 <Minus className="inline w-3 h-3" /> 删除分割点。
      </div>
      <ScrollArea className="h-[50vh] md:h-[400px] w-full border rounded-md relative bg-background outline-none focus:outline-none focus:ring-0">
        <div className="p-4 outline-none focus:outline-none">
          {lines.map((line, i) => {
             const isHeader = line.trim() === '标题';
             const isSceneName = i > 0 && lines[i-1].trim() === '标题';
             const isSplitPoint = isHeader;
             
             return (
               <div key={i} className={cn(
                 "group flex items-start py-1 px-2 hover:bg-muted/50 rounded transition-colors border-l-2 border-transparent outline-none focus:outline-none focus:ring-0 select-none tap-highlight-transparent", 
                 (isHeader || isSceneName) && "bg-yellow-500/20 font-bold border-l-yellow-500", // Highlight
                 isSplitPoint && "border-t border-t-yellow-500/50 mt-4 pt-2"
               )}>
                  <div className="w-8 text-xs text-muted-foreground pt-1 select-none text-right mr-3">{i+1}</div>
                  
                  <div className="relative w-6 h-6 mr-2 flex-shrink-0 flex items-center justify-center">
                     {isHeader ? (
                        <Button 
                           size="icon" 
                           variant="ghost" 
                           className="h-6 w-6 opacity-60 hover:opacity-100 transition-all hover:bg-destructive hover:text-destructive-foreground text-destructive" 
                           title="删除此场景分割"
                           onClick={() => handleRemoveBreak(i)}
                         >
                           <Minus className="h-3 w-3" />
                         </Button>
                     ) : (
                        <Button 
                           size="icon" 
                           variant="ghost" 
                           className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary hover:text-primary-foreground" 
                           title="在此行前插入新场景"
                           onClick={() => handleInsertBreak(i)}
                         >
                           <Plus className="h-3 w-3" />
                         </Button>
                     )}
                  </div>
                  
                  <div className="flex-1 whitespace-pre-wrap break-all text-sm leading-6">
                    {line || <span className="text-muted-foreground/30 italic h-6 block"></span>}
                  </div>
               </div>
             )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

export function TextFileEditor({
  children,
  value,
  placeholder,
  completeButtonLabel,
  loading,
  onChange,
  onChangeTemplate,
  onComplete,
}: TextFileEditorProps) {
  const disabled = useMemo(() => !!loading, [loading]);
  const { customTemplates } = useTemplates();
  const [mode, setMode] = useState<'edit' | 'split'>('edit');

  const handleFileChange = async (file: File) => {
    const text = await file.text();
    onChange(text);
  };

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    onChange(event.target.value);
  };

  const handleComplete = () => {
    onComplete(value);
  };

  const templates = useMemo(() => {
    return [
      {
        name: "对话",
        value: "对话",
      },
      ...customTemplates.map((item) => {
        return {
          name: item.name,
          value: item.name,
        };
      }),
    ];
  }, [customTemplates]);

  return (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        <Label>文本内容</Label>
        <div className="flex gap-2">
           <Button variant={mode === 'edit' ? 'secondary' : 'ghost'} size="sm" onClick={() => setMode('edit')}>
             <FileText className="w-4 h-4 mr-1" /> 编辑
           </Button>
           <Button variant={mode === 'split' ? 'secondary' : 'ghost'} size="sm" onClick={() => setMode('split')}>
             <Split className="w-4 h-4 mr-1" /> 分段
           </Button>
        </div>
      </div>
      
      {mode === 'edit' ? (
        <Textarea
          value={value}
          onChange={handleTextareaChange}
          placeholder={placeholder}
          className="min-h-[50vh] md:min-h-[400px]"
          disabled={disabled}
        />
      ) : (
        <SceneSplitter value={value} onChange={onChange} />
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {children ? (
          children
        ) : (
          <FileSelector
            disabled={disabled}
            onFileSelect={handleFileChange}
            accept=".txt"
          />
        )}
        <div className="flex flex-col md:flex-row md:items-center gap-4 md:space-x-6">
          {onChangeTemplate && (
            <div className="flex items-center space-x-2">
              <span className="text-sm whitespace-nowrap">场景模版:</span>
              <Select
                onValueChange={onChangeTemplate}
                defaultValue={templates[0].name}
              >
                <SelectTrigger className="flex-1 min-w-[150px]">
                  <SelectValue placeholder="请选择场景模版" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((option) => (
                    <SelectItem key={option.name} value={option.name}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button onClick={handleComplete} disabled={disabled} className="w-full md:w-auto">
            {loading && <Loader2 className="animate-spin mr-1" />}
            {loading ? loading : completeButtonLabel || "确定"}
          </Button>
        </div>
      </div>
    </div>
  );
}
