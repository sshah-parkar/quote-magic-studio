import { useState, useEffect } from 'react';
import { Copy, Download, RefreshCw, Sparkles, FileText, Settings } from 'lucide-react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { useToast } from '../hooks/use-toast';

type QuoteType = 'none' | 'single' | 'double' | 'backtick';
type SeparatorType = 'comma' | 'semicolon' | 'pipe' | 'space' | 'newline' | 'custom';

const EXAMPLE_PRESETS = [
  {
    name: 'Names List',
    data: 'John Smith\nJane Doe\nMike Johnson\nSarah Wilson'
  },
  {
    name: 'Programming Languages',
    data: 'JavaScript\nPython\nJava\nC++\nRust'
  },
  {
    name: 'Countries',
    data: 'United States\nUnited Kingdom\nCanada\nAustralia\nGermany'
  }
];

export default function ConverterApp() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [quoteType, setQuoteType] = useState<QuoteType>('double');
  const [separatorType, setSeparatorType] = useState<SeparatorType>('comma');
  const [customSeparator, setCustomSeparator] = useState('');
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [addSpaceAfterSeparator, setAddSpaceAfterSeparator] = useState(false);
  const { toast } = useToast();

  const getSeparator = () => {
    switch (separatorType) {
      case 'comma': return ',';
      case 'semicolon': return ';';
      case 'pipe': return '|';
      case 'space': return ' ';
      case 'newline': return '\n';
      case 'custom': return customSeparator;
      default: return ',';
    }
  };

  const getQuoteChar = () => {
    switch (quoteType) {
      case 'single': return "'";
      case 'double': return '"';
      case 'backtick': return '`';
      case 'none': return '';
      default: return '';
    }
  };

  const convertText = () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }

    let lines = input.split('\n');
    
    if (trimWhitespace) {
      lines = lines.map(line => line.trim());
    }
    
    if (removeEmpty) {
      lines = lines.filter(line => line.length > 0);
    }

    const separator = getSeparator();
    const spaceAfter = addSpaceAfterSeparator && separator !== ' ' ? ' ' : '';
    const quote = getQuoteChar();
    
    const result = lines
      .map(line => `${quote}${line}${quote}`)
      .join(separator + spaceAfter);
    
    setOutput(result);
  };

  useEffect(() => {
    convertText();
  }, [input, quoteType, separatorType, customSeparator, trimWhitespace, removeEmpty, addSpaceAfterSeparator]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast({
      title: "Copied!",
      description: "Output copied to clipboard",
    });
  };

  const downloadAsFile = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "File saved to your downloads",
    });
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
  };

  const loadPreset = (preset: typeof EXAMPLE_PRESETS[0]) => {
    setInput(preset.data);
    toast({
      title: "Preset Loaded",
      description: `Loaded "${preset.name}" example`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-subtle p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-blue-deep rounded-xl shadow-blue animate-float">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-5xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                QuoteWiz Pro
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional text converter with advanced formatting options for developers and data professionals
            </p>
          </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-blue border-0 border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Input Text
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your text here (one item per line)&#10;&#10;Example:&#10;Apple&#10;Orange&#10;Banana"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[300px] text-base resize-none"
                />
                
                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-muted-foreground">Quick examples:</span>
                  {EXAMPLE_PRESETS.map((preset) => (
                    <Badge
                      key={preset.name}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => loadPreset(preset)}
                    >
                      {preset.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="shadow-blue border-0 border-l-4 border-l-accent">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    Converted Output
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={copyToClipboard} size="sm" disabled={!output}>
                      <Copy className="w-4 h-4" />
                      Copy
                    </Button>
                    <Button onClick={downloadAsFile} size="sm" variant="professional" disabled={!output}>
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={output}
                  readOnly
                  placeholder="Your converted text will appear here..."
                  className="min-h-[200px] text-base resize-none bg-muted/50"
                />
              </CardContent>
            </Card>
          </div>

          {/* Options Panel */}
          <div className="space-y-6">
            <Card className="shadow-blue border-0 border-l-4 border-l-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Conversion Options
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="format" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="format">Format</TabsTrigger>
                    <TabsTrigger value="advanced">Advanced</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="format" className="space-y-6 mt-6">
                    {/* Quote Type */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Quote Style</Label>
                      <RadioGroup value={quoteType} onValueChange={(value) => setQuoteType(value as QuoteType)}>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="none" id="none" />
                          <Label htmlFor="none">No quotes</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="single" id="single" />
                          <Label htmlFor="single">Single quotes (')</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="double" id="double" />
                          <Label htmlFor="double">Double quotes (")</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="backtick" id="backtick" />
                          <Label htmlFor="backtick">Backticks (`)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Separator Type */}
                    <div className="space-y-3">
                      <Label className="text-base font-semibold">Separator</Label>
                      <Select value={separatorType} onValueChange={(value) => setSeparatorType(value as SeparatorType)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="comma">Comma (,)</SelectItem>
                          <SelectItem value="semicolon">Semicolon (;)</SelectItem>
                          <SelectItem value="pipe">Pipe (|)</SelectItem>
                          <SelectItem value="space">Space</SelectItem>
                          <SelectItem value="newline">New Line</SelectItem>
                          <SelectItem value="custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>

                      {separatorType === 'custom' && (
                        <Input
                          placeholder="Enter custom separator..."
                          value={customSeparator}
                          onChange={(e) => setCustomSeparator(e.target.value)}
                          className="mt-2"
                        />
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="advanced" className="space-y-6 mt-6">
                    {/* Advanced Options */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="trim" className="text-sm font-medium">Trim whitespace</Label>
                        <Switch
                          id="trim"
                          checked={trimWhitespace}
                          onCheckedChange={setTrimWhitespace}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="empty" className="text-sm font-medium">Remove empty lines</Label>
                        <Switch
                          id="empty"
                          checked={removeEmpty}
                          onCheckedChange={setRemoveEmpty}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="space" className="text-sm font-medium">Add space after separator</Label>
                        <Switch
                          id="space"
                          checked={addSpaceAfterSeparator}
                          onCheckedChange={setAddSpaceAfterSeparator}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t">
                      <Button onClick={clearAll} variant="outline" className="w-full">
                        <RefreshCw className="w-4 h-4" />
                        Clear All
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Statistics Card */}
            {input && (
              <Card className="shadow-blue border-0">
                <CardHeader>
                  <CardTitle className="text-lg">Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Input lines:</span>
                    <span className="font-semibold">{input.split('\n').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Valid items:</span>
                    <span className="font-semibold">{input.split('\n').filter(line => line.trim()).length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Output length:</span>
                    <span className="font-semibold">{output.length} chars</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
