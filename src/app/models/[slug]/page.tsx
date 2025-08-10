import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Star, ArrowLeft } from "lucide-react"

interface Props {
  params: {
    slug: string
  }
}

export default function ModelPage({ params }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg mb-6"></div>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                The Pareto Principle
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                The 80/20 rule that helps you focus on what matters most for maximum impact.
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  8 min read
                </span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Intermediate
                </span>
              </div>
            </div>
            
            <Button variant="outline" size="sm">
              <Star className="h-4 w-4 mr-2" />
              Favorite
            </Button>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>What is the Pareto Principle?</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                The Pareto Principle, also known as the 80/20 rule, states that roughly 80% of consequences come from 20% of causes. This principle was named after Italian economist Vilfredo Pareto, who observed that 80% of Italy's wealth belonged to only 20% of the population.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Example: Startup Focus</CardTitle>
              <CardDescription>How a tech startup applied the 80/20 rule</CardDescription>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                A small tech startup noticed that 80% of their customer complaints came from just 20% of their features. By focusing their limited engineering resources on fixing these critical features first, they dramatically improved customer satisfaction while using minimal resources.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>How to Apply This</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <ul>
                <li>Identify the 20% of activities that produce 80% of your results</li>
                <li>Focus your time and energy on these high-impact activities</li>
                <li>Minimize or eliminate the 80% of activities that only produce 20% of results</li>
                <li>Regularly review and adjust your focus as priorities change</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Progress Actions */}
        <div className="mt-12 flex gap-4">
          <Button className="flex-1">
            Mark as Complete
          </Button>
          <Button variant="outline">
            Take Notes
          </Button>
        </div>
      </div>
    </div>
  )
}